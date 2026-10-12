<?php
declare(strict_types=1);

const IMAGE_ROOT = __DIR__ . '/../vehicle-images';

$localConfig = __DIR__ . '/config.local.php';
if (is_file($localConfig)) {
    $values = require $localConfig;
    if (is_array($values)) {
        foreach ($values as $key => $value) {
            if (is_string($key) && (is_string($value) || is_numeric($value))) {
                putenv($key . '=' . $value);
            }
        }
    }
}

final class ApiError extends RuntimeException
{
    public function __construct(public int $status, string $message)
    {
        parent::__construct($message);
    }
}

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_name('layan_admin');
    session_set_cookie_params([
        'httponly' => true,
        'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
        'samesite' => 'Strict',
        'path' => '/',
    ]);
    session_start();
}

function db(): PDO
{
    static $pdo;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $password = getenv('LAYAN_DB_PASSWORD');
    if ($password === false || $password === '') {
        throw new ApiError(503, 'Database credentials are not configured on the server.');
    }
    try {
        $host = getenv('LAYAN_DB_HOST') ?: '127.0.0.1';
        $name = getenv('LAYAN_DB_NAME') ?: 'u866678843_layangarage';
        $user = getenv('LAYAN_DB_USER') ?: 'u866678843_layanapp';
        $dsn = 'mysql:host=' . $host . ';dbname=' . $name . ';charset=utf8mb4';
        $pdo = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (Throwable $error) {
        error_log('Layan Garage database connection failed: ' . $error->getMessage());
        throw new ApiError(503, 'Database is temporarily unavailable.');
    }
}

function respond(mixed $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail_request(string $message, int $status = 400): never
{
    throw new ApiError($status, $message);
}

function json_body(): array
{
    $data = json_decode(file_get_contents('php://input') ?: '', true);
    if (!is_array($data)) {
        fail_request('Invalid JSON request.');
    }
    return $data;
}

function request_path(): string
{
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $path = preg_replace('#^/api(?=/|$)#', '', $path) ?: '/';
    return '/' . trim($path, '/');
}

function current_user(): ?array
{
    start_session();
    return isset($_SESSION['user']) && is_array($_SESSION['user']) ? $_SESSION['user'] : null;
}

function require_admin(): array
{
    $user = current_user();
    if (!$user) {
        fail_request('Authentication required.', 401);
    }
    return $user;
}

function require_csrf(): void
{
    start_session();
    $expected = $_SESSION['csrf'] ?? '';
    $received = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if ($expected === '' || !hash_equals($expected, $received)) {
        fail_request('Invalid CSRF token.', 403);
    }
}

function clean_slug(string $value): string
{
    $value = strtolower(trim($value));
    $value = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value) ?: $value;
    $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?: '';
    return trim(substr($value, 0, 90), '-');
}

function uuid(): string
{
    $bytes = random_bytes(16);
    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
    $hex = bin2hex($bytes);
    return sprintf(
        '%s-%s-%s-%s-%s',
        substr($hex, 0, 8),
        substr($hex, 8, 4),
        substr($hex, 12, 4),
        substr($hex, 16, 4),
        substr($hex, 20, 12)
    );
}

function bool_value(mixed $value): int
{
    return filter_var($value, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
}

function int_or_null(mixed $value): ?int
{
    if ($value === null || $value === '') {
        return null;
    }
    return filter_var($value, FILTER_VALIDATE_INT) === false ? null : (int) $value;
}

function database_whole_number(mixed $value): ?int
{
    if ($value === null || $value === '') {
        return null;
    }
    // PDO may return a DECIMAL as a string (e.g. "29900.00").
    if (is_string($value) && preg_match('/^\d+\.00$/', $value)) {
        $value = substr($value, 0, -3);
    }
    $number = filter_var($value, FILTER_VALIDATE_INT, ['options' => ['min_range' => 0]]);
    if ($number === false) {
        fail_request('Invalid price or mileage.');
    }
    return (int) $number;
}

function vehicle_payload(array $data, ?array $existing = null): array
{
    $title = trim((string) ($data['title'] ?? $existing['title'] ?? ''));
    $brand = trim((string) ($data['brand'] ?? $existing['brand'] ?? ''));
    $model = trim((string) ($data['model'] ?? $existing['model'] ?? ''));
    $title = $title !== '' ? $title : trim($brand . ' ' . $model);
    if ($title === '') {
        fail_request('Vehicle title is required.');
    }
    $status = (string) ($data['status'] ?? $existing['status'] ?? 'available');
    if (!in_array($status, ['available', 'reserved', 'sold'], true)) {
        fail_request('Invalid vehicle status.');
    }
    $slug = clean_slug((string) ($data['slug'] ?? $existing['slug'] ?? $title));
    if ($slug === '') {
        fail_request('Vehicle slug is required.');
    }
    return [
        'slug' => $slug,
        'title' => $title,
        'brand' => $brand,
        'model' => $model,
        'year' => int_or_null($data['year'] ?? $existing['year'] ?? null),
        'price' => database_whole_number($data['price'] ?? $existing['price'] ?? null),
        'mileage' => database_whole_number($data['mileage'] ?? $existing['mileage'] ?? null),
        'fuel_type' => trim((string) ($data['fuel_type'] ?? $existing['fuel_type'] ?? '')),
        'engine' => trim((string) ($data['engine'] ?? $existing['engine'] ?? '')),
        'vermogen' => trim((string) ($data['vermogen'] ?? $existing['vermogen'] ?? '')),
        'transmission' => trim((string) ($data['transmission'] ?? $existing['transmission'] ?? '')),
        'euro_norm' => trim((string) ($data['euro_norm'] ?? $existing['euro_norm'] ?? '')),
        'seats' => int_or_null($data['seats'] ?? $existing['seats'] ?? null),
        'condition' => (($data['condition'] ?? $existing['condition'] ?? 'used') === 'new') ? 'new' : 'used',
        'description' => trim((string) ($data['description'] ?? $existing['description'] ?? '')),
        'status' => $status,
        'is_visible' => bool_value($data['is_visible'] ?? $existing['is_visible'] ?? true),
        'display_order' => int_or_null($data['display_order'] ?? $existing['display_order'] ?? 0) ?? 0,
    ];
}

function hydrate_vehicles(array $vehicles): array
{
    if (!$vehicles) {
        return [];
    }
    $ids = array_values(array_filter(array_map(static fn($row) => $row['id'] ?? null, $vehicles)));
    $marks = implode(',', array_fill(0, count($ids), '?'));
    $pdo = db();

    $featureQuery = $pdo->prepare('SELECT id, vehicle_id, label, display_order, created_at FROM vehicle_features WHERE vehicle_id IN (' . $marks . ') ORDER BY display_order ASC, created_at ASC');
    $featureQuery->execute($ids);
    $features = [];
    foreach ($featureQuery as $row) {
        $features[$row['vehicle_id']][] = $row;
    }

    $imageQuery = $pdo->prepare('SELECT id, vehicle_id, storage_path, alt_text, is_featured, display_order, created_at FROM vehicle_images WHERE vehicle_id IN (' . $marks . ') ORDER BY display_order ASC, created_at ASC');
    $imageQuery->execute($ids);
    $images = [];
    foreach ($imageQuery as $row) {
        $row['is_featured'] = (bool) $row['is_featured'];
        $images[$row['vehicle_id']][] = $row;
    }

    foreach ($vehicles as &$vehicle) {
        $vehicle['is_visible'] = (bool) $vehicle['is_visible'];
        $vehicle['vehicle_features'] = $features[$vehicle['id']] ?? [];
        $vehicle['vehicle_images'] = $images[$vehicle['id']] ?? [];
    }
    unset($vehicle);
    return $vehicles;
}

function find_vehicle(string $id): array
{
    $query = db()->prepare('SELECT * FROM vehicles WHERE id = ? LIMIT 1');
    $query->execute([$id]);
    $vehicle = $query->fetch();
    if (!$vehicle) {
        fail_request('Vehicle not found.', 404);
    }
    return $vehicle;
}

function safe_image_path(string $path): string
{
    $path = str_replace('\\', '/', trim($path));
    if ($path === '' || str_contains($path, '..') || !preg_match('#^vehicles/[a-z0-9-]+/[a-z0-9._-]+$#i', $path)) {
        fail_request('Invalid image path.');
    }
    return $path;
}

function image_file(string $path): string
{
    return IMAGE_ROOT . '/' . safe_image_path($path);
}

function vehicle_image_files(string $vehicleId): array
{
    $query = db()->prepare('SELECT storage_path FROM vehicle_images WHERE vehicle_id = ?');
    $query->execute([$vehicleId]);
    return array_map(static fn($row) => image_file((string) $row['storage_path']), $query->fetchAll());
}

function remove_image_files(array $files): void
{
    foreach ($files as $file) {
        if (is_file($file)) {
            @unlink($file);
        }
    }
}

function admin_password_hash(string $email): ?string
{
    $hashes = getenv('LAYAN_ADMIN_PASSWORD_HASHES');
    if ($hashes !== false && $hashes !== '') {
        $map = json_decode($hashes, true);
        if (is_array($map)) {
            $hash = $map[$email] ?? null;
            return is_string($hash) && $hash !== '' ? $hash : null;
        }
    }
    return null;
}

function login(): never
{
    start_session();
    $now = time();
    $attempts = array_values(array_filter($_SESSION['login_attempts'] ?? [], static fn($time) => ($now - (int) $time) < 900));
    if (count($attempts) >= 10) {
        fail_request('Too many login attempts. Try again later.', 429);
    }
    $data = json_body();
    $email = strtolower(trim((string) ($data['email'] ?? '')));
    $password = (string) ($data['password'] ?? '');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) {
        fail_request('Invalid login details.', 422);
    }
    $hash = admin_password_hash($email);
    if ($hash === null) {
        throw new ApiError(503, 'Admin authentication is not configured on the server.');
    }
    $query = db()->prepare('SELECT id, user_id, email, role FROM admin_users WHERE LOWER(email) = LOWER(?) LIMIT 1');
    $query->execute([$email]);
    $user = $query->fetch();
    $attempts[] = $now;
    $_SESSION['login_attempts'] = $attempts;
    if (!$user || !password_verify($password, $hash)) {
        fail_request('E-mail of wachtwoord is niet correct.', 401);
    }
    session_regenerate_id(true);
    $_SESSION['user'] = [
        'id' => $user['id'],
        'user_id' => $user['user_id'],
        'email' => $user['email'],
        'role' => $user['role'],
    ];
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    $_SESSION['login_attempts'] = [];
    respond(['user' => $_SESSION['user'], 'csrf' => $_SESSION['csrf']]);
}

function route(): never
{
    start_session();
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $path = request_path();

    if ($method === 'GET' && $path === '/health') {
        db()->query('SELECT 1');
        respond(['ok' => true]);
    }
    if ($method === 'POST' && $path === '/auth/login') {
        login();
    }
    if ($method === 'GET' && $path === '/auth/session') {
        $user = current_user();
        respond(['user' => $user, 'csrf' => $user ? ($_SESSION['csrf'] ?? '') : null]);
    }
    if ($method === 'POST' && $path === '/auth/logout') {
        require_admin();
        require_csrf();
        $_SESSION = [];
        session_destroy();
        respond(['ok' => true]);
    }
    if ($method === 'GET' && $path === '/vehicles') {
        $admin = (($_GET['admin'] ?? '') === '1');
        if ($admin) {
            require_admin();
        }
        $sql = 'SELECT * FROM vehicles' . ($admin ? '' : ' WHERE is_visible = 1') . ' ORDER BY created_at DESC, display_order ASC, title ASC';
        respond(hydrate_vehicles(db()->query($sql)->fetchAll()));
    }

    if (preg_match('#^/vehicles/([^/]+)/features$#', $path, $matches) && $method === 'PUT') {
        require_admin();
        require_csrf();
        $vehicleId = $matches[1];
        find_vehicle($vehicleId);
        $labels = json_body()['labels'] ?? [];
        if (!is_array($labels)) {
            fail_request('Features must be an array.');
        }
        $pdo = db();
        $pdo->beginTransaction();
        try {
            $pdo->prepare('DELETE FROM vehicle_features WHERE vehicle_id = ?')->execute([$vehicleId]);
            $insert = $pdo->prepare('INSERT INTO vehicle_features (id, vehicle_id, label, display_order) VALUES (?, ?, ?, ?)');
            foreach (array_values(array_filter(array_map(static fn($label) => trim((string) $label), $labels))) as $index => $label) {
                $insert->execute([uuid(), $vehicleId, $label, $index]);
            }
            $pdo->commit();
        } catch (Throwable $error) {
            $pdo->rollBack();
            throw $error;
        }
        respond(['ok' => true]);
    }

    if (preg_match('#^/vehicles/([^/]+)/images$#', $path, $matches) && $method === 'POST') {
        require_admin();
        require_csrf();
        $vehicle = find_vehicle($matches[1]);
        if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
            fail_request('Image file is required.');
        }
        if ((int) ($_FILES['file']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            fail_request('Image upload failed or exceeded server limits.');
        }
        if (!isset($_FILES['file']['tmp_name']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
            fail_request('Image file is required.');
        }
        if ((int) $_FILES['file']['size'] <= 0 || (int) $_FILES['file']['size'] > 5 * 1024 * 1024) {
            fail_request('Image must be between 1 byte and 5 MB.');
        }
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($_FILES['file']['tmp_name']);
        $extensions = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
        if (!isset($extensions[$mime])) {
            fail_request('Only JPEG, PNG, and WebP images are accepted.');
        }
        $imageInfo = @getimagesize($_FILES['file']['tmp_name']);
        if ($imageInfo === false || ($imageInfo['mime'] ?? '') !== $mime
            || ($imageInfo[0] ?? 0) < 1 || ($imageInfo[1] ?? 0) < 1
            || ($imageInfo[0] ?? 0) > 12000 || ($imageInfo[1] ?? 0) > 12000) {
            fail_request('Invalid image content or dimensions.');
        }
        $slug = clean_slug((string) $vehicle['slug']);
        $dir = IMAGE_ROOT . '/vehicles/' . $slug;
        if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
            throw new ApiError(500, 'Image directory could not be created.');
        }
        $orderQuery = db()->prepare('SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM vehicle_images WHERE vehicle_id = ?');
        $orderQuery->execute([$vehicle['id']]);
        $displayOrder = (int) ($orderQuery->fetch()['next_order'] ?? 0);
        $filename = $slug . '-' . str_pad((string) ($displayOrder + 1), 2, '0', STR_PAD_LEFT) . '-' . bin2hex(random_bytes(4)) . '.' . $extensions[$mime];
        $relative = 'vehicles/' . $slug . '/' . $filename;
        $destination = image_file($relative);
        if (!move_uploaded_file($_FILES['file']['tmp_name'], $destination)) {
            throw new ApiError(500, 'Image could not be stored.');
        }
        $featured = bool_value($_POST['is_featured'] ?? false);
        $pdo = db();
        try {
            if ($featured) {
                $pdo->prepare('UPDATE vehicle_images SET is_featured = 0 WHERE vehicle_id = ?')->execute([$vehicle['id']]);
            }
            $insert = $pdo->prepare('INSERT INTO vehicle_images (id, vehicle_id, storage_path, alt_text, is_featured, display_order) VALUES (?, ?, ?, ?, ?, ?)');
            $insert->execute([uuid(), $vehicle['id'], $relative, trim((string) ($_POST['alt_text'] ?? ($vehicle['title'] . ' foto'))), $featured, $displayOrder]);
        } catch (Throwable $error) {
            @unlink($destination);
            throw $error;
        }
        $query = $pdo->prepare('SELECT id, vehicle_id, storage_path, alt_text, is_featured, display_order, created_at FROM vehicle_images WHERE vehicle_id = ? AND storage_path = ? LIMIT 1');
        $query->execute([$vehicle['id'], $relative]);
        $row = $query->fetch();
        $row['is_featured'] = (bool) $row['is_featured'];
        respond($row, 201);
    }

    if (preg_match('#^/vehicles/([^/]+)/images/reorder$#', $path, $matches) && $method === 'PUT') {
        require_admin();
        require_csrf();
        find_vehicle($matches[1]);
        $ids = json_body()['ids'] ?? [];
        if (!is_array($ids)) {
            fail_request('Image order must be an array.');
        }
        $update = db()->prepare('UPDATE vehicle_images SET display_order = ? WHERE id = ? AND vehicle_id = ?');
        foreach (array_values($ids) as $index => $id) {
            $update->execute([$index, (string) $id, $matches[1]]);
        }
        respond(['ok' => true]);
    }

    if (preg_match('#^/vehicles/([^/]+)$#', $path, $matches) && in_array($method, ['PUT', 'DELETE'], true)) {
        require_admin();
        require_csrf();
        $vehicleId = $matches[1];
        $existing = find_vehicle($vehicleId);
        if ($method === 'DELETE') {
            $imageFiles = vehicle_image_files($vehicleId);
            $pdo = db();
            $pdo->beginTransaction();
            try {
                $pdo->prepare('DELETE FROM vehicle_images WHERE vehicle_id = ?')->execute([$vehicleId]);
                $pdo->prepare('DELETE FROM vehicle_features WHERE vehicle_id = ?')->execute([$vehicleId]);
                $pdo->prepare('DELETE FROM vehicles WHERE id = ?')->execute([$vehicleId]);
                $pdo->commit();
            } catch (Throwable $error) {
                $pdo->rollBack();
                throw $error;
            }
            remove_image_files($imageFiles);
            respond(['ok' => true]);
        }
        $payload = vehicle_payload(json_body(), $existing);
        $query = db()->prepare('UPDATE vehicles SET slug = ?, title = ?, brand = ?, model = ?, year = ?, price = ?, mileage = ?, fuel_type = ?, engine = ?, vermogen = ?, transmission = ?, euro_norm = ?, seats = ?, `condition` = ?, description = ?, status = ?, is_visible = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP(6) WHERE id = ?');
        $query->execute([...array_values($payload), $vehicleId]);
        respond(hydrate_vehicles([find_vehicle($vehicleId)])[0]);
    }

    if ($method === 'POST' && $path === '/vehicles') {
        require_admin();
        require_csrf();
        $payload = vehicle_payload(json_body());
        $id = uuid();
        $query = db()->prepare('INSERT INTO vehicles (id, slug, title, brand, model, year, price, mileage, fuel_type, engine, vermogen, transmission, euro_norm, seats, `condition`, description, status, is_visible, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $query->execute([$id, ...array_values($payload)]);
        respond(hydrate_vehicles([find_vehicle($id)])[0], 201);
    }

    if (preg_match('#^/images/([^/]+)/featured$#', $path, $matches) && $method === 'PUT') {
        require_admin();
        require_csrf();
        $data = json_body();
        $vehicleId = (string) ($data['vehicle_id'] ?? '');
        if ($vehicleId === '') {
            fail_request('Vehicle id is required.');
        }
        find_vehicle($vehicleId);
        $imageCheck = db()->prepare('SELECT id FROM vehicle_images WHERE id = ? AND vehicle_id = ? LIMIT 1');
        $imageCheck->execute([$matches[1], $vehicleId]);
        if (!$imageCheck->fetch()) {
            fail_request('Image does not belong to this vehicle.', 404);
        }
        $pdo = db();
        $pdo->beginTransaction();
        try {
            $pdo->prepare('UPDATE vehicle_images SET is_featured = 0 WHERE vehicle_id = ?')->execute([$vehicleId]);
            $pdo->prepare('UPDATE vehicle_images SET is_featured = 1 WHERE id = ? AND vehicle_id = ?')->execute([$matches[1], $vehicleId]);
            $pdo->commit();
        } catch (Throwable $error) {
            $pdo->rollBack();
            throw $error;
        }
        respond(['ok' => true]);
    }

    if (preg_match('#^/images/([^/]+)$#', $path, $matches) && $method === 'DELETE') {
        require_admin();
        require_csrf();
        $query = db()->prepare('SELECT storage_path FROM vehicle_images WHERE id = ? LIMIT 1');
        $query->execute([$matches[1]]);
        $image = $query->fetch();
        if (!$image) {
            fail_request('Image not found.', 404);
        }
        db()->prepare('DELETE FROM vehicle_images WHERE id = ?')->execute([$matches[1]]);
        $file = image_file((string) $image['storage_path']);
        if (is_file($file)) {
            @unlink($file);
        }
        respond(['ok' => true]);
    }

    fail_request('Route not found.', 404);
}

try {
    route();
} catch (ApiError $error) {
    respond(['error' => $error->getMessage()], $error->status);
} catch (Throwable $error) {
    error_log('Layan Garage API error: ' . $error->getMessage());
    respond(['error' => 'Unexpected server error.'], 500);
}

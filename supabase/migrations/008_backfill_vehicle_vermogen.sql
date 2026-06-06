-- Split legacy trailing PK values out of Motor and store them in Vermogen.
-- Only rows with an empty vermogen value and a trailing "<number> PK" are changed.
with parsed_power as (
  select
    id,
    ((regexp_match(engine, '([0-9]+)\s*PK\s*$', 'i'))[1])::integer as pk
  from public.vehicles
  where vermogen = ''
    and engine ~* '[0-9]+\s*PK\s*$'
)
update public.vehicles as vehicle
set
  vermogen = concat(round(parsed_power.pk * 0.73549875), ' kW / ', parsed_power.pk, ' PK'),
  engine = trim(regexp_replace(vehicle.engine, '\s*[0-9]+\s*PK\s*$', '', 'i')),
  updated_at = now()
from parsed_power
where vehicle.id = parsed_power.id;

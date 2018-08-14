
-- Remove colums ---------------------------
ALTER TABLE severe_weather.details
	DROP COLUMN IF EXISTS geoid,
	DROP COLUMN IF EXISTS cousub_geoid;

-- Add new colums ---------------------------
ALTER TABLE severe_weather.details
	ADD COLUMN geoid VARCHAR(11) DEFAULT NULL,
	ADD COLUMN cousub_geoid VARCHAR(10) DEFAULT NULL;

-- Check for tract geoids from geo.tl_2017_36_tract
UPDATE severe_weather.details
SET geoid = (
	SELECT geotl.geoid
	FROM geo.tl_2017_36_tract AS geotl
	WHERE ST_Contains(geotl.geom, ST_Transform(begin_coords_geom, 4269))
)
WHERE geoid IS NULL
AND state_fips = '36'
AND begin_coords_geom IS NOT NULL;

-- Check for county fips
UPDATE severe_weather.details
SET geoid = state_fips || LPAD(cz_fips::TEXT, 3, '0')
WHERE geoid IS NULL
AND state_fips = '36';

-- Otherwise set geoid based on state_fips
UPDATE severe_weather.details
SET geoid = state_fips
WHERE geoid IS NULL
AND state_fips = '36';

-- Check for cousub geoids from geo.tl_2017_36_cousub
UPDATE severe_weather.details
SET cousub_geoid = (
	SELECT geotl.geoid
	FROM geo.tl_2017_36_cousub AS geotl
	WHERE ST_Contains(geotl.geom, ST_Transform(begin_coords_geom, 4269))
)
WHERE cousub_geoid IS NULL
AND state_fips = '36'
AND begin_coords_geom IS NOT NULL;
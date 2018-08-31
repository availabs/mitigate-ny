
-- Remove colums ---------------------------
ALTER TABLE public."STRUCT_New_York_State_GDB Struct_Point"
	DROP COLUMN IF EXISTS geoid,
	DROP COLUMN IF EXISTS cousub_geoid;

-- Add new colums ---------------------------
ALTER TABLE public."STRUCT_New_York_State_GDB Struct_Point"
	ADD COLUMN geoid VARCHAR(11) DEFAULT NULL,
	ADD COLUMN cousub_geoid VARCHAR(10) DEFAULT NULL;

-- UPDATE geoid
UPDATE public."STRUCT_New_York_State_GDB Struct_Point" AS crit
SET geoid = (
	SELECT geotl.geoid
	FROM geo.tl_2017_tract AS geotl
	WHERE ST_Contains(geotl.geom, crit.geom)
)
WHERE geoid IS NULL
AND crit.geom IS NOT NULL;

-- UPDATE cousub_geoid
UPDATE public."STRUCT_New_York_State_GDB Struct_Point" AS crit
SET cousub_geoid = (
	SELECT geotl.geoid
	FROM geo.tl_2017_cousub AS geotl
	WHERE ST_Contains(geotl.geom, crit.geom)
)
WHERE cousub_geoid IS NULL
AND crit.geom IS NOT NULL;
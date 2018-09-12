import argparse, csv, os, psycopg2, re

from config import host

CSV_FILE = 'ogs.csv'
'''
0: Business Unit
1: Agency Name
2: Financial Asset ID
3: Property Asset ID
4: Financial Asset Description
5: Tag Number
6: Status
7: Profile ID
8: Profile Description
9: County
10: City/Town
11: Location Code
12: Total Area (SF)
13: Exterior Gross
14: Interior Gross
15: Number of Floors
16: Acquisition Date
17: Acquisition Type
18: Construction Date
19: Replacement Cost
20: Condition Code
21: Condition
22: Location Group Code
23: Location Group
24: Total Site Acreage
25: Site Description
26: OGS Region
27: Building Latitude
28: Building Longitude
29: Site Latitude
30: Site Longitude
31: Property Asset ID
'''

def toInt(string):
	try:
		string = string.strip()
		if len(string) is 0:
			return None
		return int(string)
	except:
		print "toInt ERROR:", string
		return None
# END toInt

def toString(string):
	try:
		string = string.strip()
		if len(string) is 0:
			return None
		return string
	except:
		print "toString ERROR:", string
		return None
# END toString

def toFloat(string):
	try:
		string = string.strip()
		if len(string) is 0:
			return None
		return float(string)
	except:
		print "toFloat ERROR:", string
		return None
# END toFloat

def toCoords(string):
	try:
		string = string.strip()
		if len(string) is 0:
			return None
		asFloat = float(string)
		if asFloat == 0.0:
			return None
		return asFloat
	except Exception as e:
		print "toCoords ERROR:", string, e
		return None
# END toCoords

META = [
	{ "column": "business_unit",				"type": "VARCHAR",	"convert": toString },
	{ "column": "agency",						"type": "VARCHAR",	"convert": toString },
	{ "column": "financial_asset_id",			"type": "VARCHAR",	"convert": toString },
	{ "column": "property_asset_id",			"type": "VARCHAR",	"convert": toString },
	{ "column": "financial_asset_description",	"type": "VARCHAR",	"convert": toString },
	{ "column": "tag_number",					"type": "VARCHAR",	"convert": toString },
	{ "column": "status",						"type": "VARCHAR",	"convert": toString },
	{ "column": "profile_is",					"type": "VARCHAR",	"convert": toString },
	{ "column": "profile_description",			"type": "VARCHAR",	"convert": toString },
	{ "column": "county",						"type": "VARCHAR",	"convert": toString },
	{ "column": "city_town",					"type": "VARCHAR",	"convert": toString },
	{ "column": "location_code",				"type": "VARCHAR",	"convert": toString },
	{ "column": "total_area",					"type": "NUMERIC",	"convert": toFloat },
	{ "column": "exterior_gross",				"type": "BIGINT",	"convert": toInt },
	{ "column": "interior_gross",				"type": "BIGINT",	"convert": toInt },
	{ "column": "number_of_floors",				"type": "INTEGER",	"convert": toInt },
	{ "column": "acquisition_date",				"type": "DATE",		"convert": toString },
	{ "column": "acquisition_type",				"type": "VARCHAR",	"convert": toString },
	{ "column": "construction_date",			"type": "DATE",		"convert": toString },
	{ "column": "replacement_cost",				"type": "NUMERIC",	"convert": toFloat },
	{ "column": "condition_code",				"type": "VARCHAR",	"convert": toString },
	{ "column": "condition",					"type": "VARCHAR",	"convert": toString },
	{ "column": "location_group_code",			"type": "VARCHAR",	"convert": toString },
	{ "column": "location_group",				"type": "VARCHAR",	"convert": toString },
	{ "column": "total_site_acreage",			"type": "NUMERIC",	"convert": toFloat },
	{ "column": "site_description",				"type": "VARCHAR",	"convert": toString },
	{ "column": "ogs_region",					"type": "VARCHAR",	"convert": toString },
	{ "column": "building_latitude",			"type": "NUMERIC",	"convert": toCoords },
	{ "column": "building_longitude",			"type": "NUMERIC",	"convert": toCoords },
	{ "column": "site_latitude",				"type": "NUMERIC",	"convert": toCoords },
	{ "column": "site_longitude",				"type": "NUMERIC",	"convert": toCoords }
]

def convert(meta, v):
	return meta["convert"](v)
# END convert

def createTable(cursor):
	print "CREATING TABLE..."
	sql = """
		DROP TABLE IF EXISTS public.ogs;
		CREATE TABLE public.ogs (
			{},
			geoid VARCHAR(11) DEFAULT NULL,
			cousub_geoid VARCHAR(10) DEFAULT NULL,
			id BIGSERIAL PRIMARY KEY
		)
	"""
	columns = ["{} {}".format(meta["column"], meta["type"]) for meta in META]
	cursor.execute(sql.format(",".join(columns)))
	print "TABLE CREATED.\n"
# END createTable

def prepareStatement(cursor):
	columns = ",".join([meta["column"] for meta in META])
	variables = ",".join(['$' + str(i + 1) for i in range(len(META))])

	sql = """
		INSERT INTO public.ogs({})
		VALUES ({})
	""".format(columns, variables)
	try:
		cursor.execute("PREPARE stmt AS {}".format(sql))
	except Exception as e:
		print e
		return False
	else:
		return True
# END prepareStatement

def deallocateStatement(cursor):
	cursor.execute("DEALLOCATE stmt")
# END deallocateStatement

def transform(row):

	column3 = row[3]
	column31 = row[31]

	if (column3.lower() == "null") or (len(column3) == 0):
		column3 = ""
	if (column31.lower() == "null") or (len(column31) == 0):
		column31 = ""

	row[3] = column3 or column31

	return row[0 : 31]
# END transform

def loadCsvData(cursor, inputUrl):
	if not prepareStatement(cursor):
		return

	inserts = ",".join(["%s" for meta in META])
	sql = """
		EXECUTE stmt({})
	""".format(inserts)

	print 'LOADING CSV DATA "{}"...'.format(inputUrl)

	firstLineRead = False
	try:
		with open(inputUrl, 'rb') as data:
			reader = csv.reader(data, delimiter=',')
			for row in reader:
				if firstLineRead:
					row = map(convert, META, transform(row))
					cursor.execute(sql, row)
				else:
					firstLineRead = True
				# end if
			# end for
		# end with
	except Exception as e:
		print e
	else:
		print "CSV DATA LOADED.\n"

	deallocateStatement(cursor)
# END loadCsvData

def addGeoids(cursor):
	print "CREATING COLUMNS..."
	sql = """
		ALTER TABLE public.ogs
		DROP COLUMN IF EXISTS geoid,
		DROP COLUMN IF EXISTS cousub_geoid;

		ALTER TABLE public.ogs
		ADD COLUMN geoid VARCHAR(11) DEFAULT NULL,
		ADD COLUMN cousub_geoid VARCHAR(10) DEFAULT NULL;
	"""
	cursor.execute(sql);
	print "CREATED COLUMNS. \n"

	print "STARTING GEOID FIRST PASS..."
	print "THIS MAY TAKE A FEW MINUTES..."
	sql = """
		UPDATE public.ogs AS ogs
		SET geoid = (
			SELECT geotl.geoid
			FROM geo.tl_2017_tract AS geotl
			WHERE ST_Contains(
				geotl.geom, ST_Transform(
								ST_SetSrid(
									ST_MakePoint(
										COALESCE(ogs.building_longitude, ogs.site_longitude), 
										COALESCE(ogs.building_latitude, ogs.site_latitude)
									)
								, 4326)
							, 4269)
						)
		)
		WHERE geoid IS NULL
		AND COALESCE(building_longitude, site_longitude) IS NOT NULL
		AND COALESCE(building_latitude, site_latitude) IS NOT NULL;
	"""
	cursor.execute(sql);
	print "COMPLETED GEOID FIRST PASS.\n"

	sql = """
		UPDATE public.ogs
		SET county = 'St. Lawrence'
		WHERE county = 'St Lawrence'
	"""
	cursor.execute(sql);

	sql = """
		UPDATE public.ogs
		SET county = 'Richmond'
		WHERE county = 'Richmond (Sttn Is)'
	"""
	cursor.execute(sql);

	print "STARTING GEOID SECOND PASS..."
	sql = """
		UPDATE public.ogs AS ogs
		SET geoid = (
			SELECT DISTINCT geotl.geoid
			FROM geo.tl_2017_us_county AS geotl
			WHERE LOWER(geotl.name) = LOWER(ogs.county)
			AND geotl.statefp = '36'
		)
		WHERE geoid IS NULL;
	"""
	cursor.execute(sql);
	print "COMPLETED GEOID SECOND PASS.\n"

	print "STARTING GEOID THIRD PASS..."
	sql = """
		UPDATE public.ogs AS ogs
		SET geoid = '36'
		WHERE geoid IS NULL;
	"""
	cursor.execute(sql);
	print "COMPLETED GEOID THIRD PASS.\n"

	print "STARTIG COUSUB GEOID FIRST PASS..."
	print "THIS MAY TAKE A FEW MINUTES..."
	sql = """
		UPDATE public.ogs AS ogs
		SET cousub_geoid = (
			SELECT geotl.geoid
			FROM geo.tl_2017_cousub AS geotl
			WHERE ST_Contains(
				geotl.geom, ST_Transform(
								ST_SetSrid(
									ST_MakePoint(
										COALESCE(ogs.building_longitude, ogs.site_longitude), 
										COALESCE(ogs.building_latitude, ogs.site_latitude)
									)
								, 4326)
							, 4269)
						)
		)
		WHERE cousub_geoid IS NULL
		AND COALESCE(building_longitude, site_longitude) IS NOT NULL
		AND COALESCE(building_latitude, site_latitude) IS NOT NULL;
	"""
	cursor.execute(sql);
	print "COMPLETED COUSUB GEOID FIRST PASS.\n"

	print "STARTING COUSUB GEOID SECOND PASS..."
	sql = """
		UPDATE public.ogs AS ogs
		SET cousub_geoid = (
			SELECT DISTINCT geotl.geoid
			FROM geo.tl_2017_cousub AS geotl
			WHERE LOWER(geotl.name) = LOWER(ogs.city_town)
			AND geotl.statefp = '36'
		)
		WHERE cousub_geoid IS NULL
		AND city_town IS NOT NULL
		AND city_town NOT IN ('Ithaca', 'Middletown', 'Poughkeepsie', 'Salamanca');
	"""
	cursor.execute(sql);
	print "COMPLETED COUSUB GEOID SECOND PASS.\n"
# END addGeoids

parser = argparse.ArgumentParser(description='OGS CSV table loader.')

parser.add_argument('-i', '--input-url',
				dest='inputUrl',
				default=CSV_FILE,
				metavar='<Input URL>',
				help='URL for .csv input file. Defaults to {}.'.format(CSV_FILE))

def main():
	args = vars(parser.parse_args())

	connection = psycopg2.connect(host)
	cursor = connection.cursor()

	createTable(cursor)
	connection.commit()

	loadCsvData(cursor, **args)
	connection.commit()

	addGeoids(cursor)
	connection.commit()

	cursor.close()
	connection.close()
# END main

if __name__ == "__main__":
	main()
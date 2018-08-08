import argparse, csv, io, os, psycopg2

from config import host

HOME_DIR = os.environ['HOME']

UNCONVERTED_BUSINESS_FILE = HOME_DIR + '/Downloads/sba_disaster_loan_data_business_FY01-17.csv'
BUSINESS_FILE = 'sba_business_FY01-17.csv'

UNCONVERTED_HOME_FILE = HOME_DIR + '/Downloads/sba_disaster_loan_data_home_FY01-17.csv'
HOME_FILE = 'sba_home_FY01-17.csv'

# this can be copy-pasted from routes/metadata.js in mitigate-api
HAZARD_ID_TO_FEMA_DISASTERS = {
    'wind': [
        "Severe Storm(s)"
    ],
    'wildfire': [
        "Fire"
    ],
    'tsunami': [
        "Tsunami"
    ],
    'tornado': [
        "Tornado"
    ],
    'riverine': [
        "Flood"
    ],
    'lightning': [
    ],
    'landslide': [
        "Mud/Landslide"
    ],
    'icestorm': [
        "Severe Ice Storm"
    ],
    'hurricane': [
        "Hurricane",
        "Typhoon"
    ],
    'heatwave': [
    ],
    'hail': [
    ],
    'earthquake': [
        "Earthquake"
    ],
    'drought': [
        "Drought"
    ],
    'avalanche': [
    ],
    'coldwave': [
        "Freezing"
    ],
    'winterweat': [
        "Snow"
    ],
    'volcano': [
        "Volcano"
    ],
    'coastal': [
        "Coastal Storm"
    ]
}
FEMA_DISASTER_TO_HAZARDID = {}
for hazardid in HAZARD_ID_TO_FEMA_DISASTERS:
	for fema_disaster in HAZARD_ID_TO_FEMA_DISASTERS[hazardid]:
		FEMA_DISASTER_TO_HAZARDID[fema_disaster] = hazardid

def toFloat(string):
	try:
		if len(string) is 0:
			return None
		return float(string.replace(",", ""))
	except:
		print "toFloat ERROR:", string

def toString(string):
	try:
		if len(string) is 0:
			return None
		return string
	except:
		print "toString ERROR:", string

def toInt(string):
	try:
		if len(string) is 0:
			return None
		return int(string)
	except:
		print "toInt ERROR:", string

def tryTransformRow(row):
# This transform is required because some rows
# have their zip code and city name switched.
# If row[6] cannot be converted to an integer
# and is not length 0, then swap rows 5 and 6.
	try:
		int(row[6])
	except:
		if len(row[6]) > 0:
			temp = row[5]
			row[5] = row[6]
			row[6] = temp
	finally:
		return row

def convert(meta, v):
	return meta["convert"](v)

BUSINESS_META = [
	{ "convert": toInt, "type": "INTEGER", "name": None },
	{ "convert": toString, "type": "TEXT", "name": None },
	{ "convert": toString, "type": "TEXT", "name": None },
	{ "convert": toString, "type": "TEXT", "name": None },
	{ "convert": toString, "type": "TEXT", "name": None },
	{ "convert": toString, "type": "TEXT", "name": None },
	{ "convert": toInt, "type": "INTEGER", "name": None },
	{ "convert": toString, "type": "TEXT", "name": None },
	{ "convert": toString, "type": "TEXT", "name": None },
	{ "convert": toFloat, "type": "NUMERIC", "name": None },
	{ "convert": toFloat, "type": "NUMERIC", "name": None },
	{ "convert": toFloat, "type": "NUMERIC", "name": None },
	{ "convert": toFloat, "type": "NUMERIC", "name": None },
	{ "convert": toFloat, "type": "NUMERIC", "name": None },
	{ "convert": toFloat, "type": "NUMERIC", "name": None },
	{ "convert": toFloat, "type": "NUMERIC", "name": None },
	{ "type": "TEXT", "name": "loan_type" }
]

def createTable(cursor):
	sql = """
		DROP TABLE IF EXISTS public.sba_disaster_loan_data;

		CREATE TABLE public.sba_disaster_loan_data (
			{},

			hazardid TEXT DEFAULT NULL,
			geoid VARCHAR(10) DEFAULT NULL,
			fema_date DATE DEFAULT NULL,
			entry_id SERIAL PRIMARY KEY
		)
	"""

	columns = []
	for meta in BUSINESS_META:
		columns.append("{} {}".format(meta["name"], meta["type"]))

	cursor.execute(sql.format(",".join(columns)))

def prepareStatement(cursor):
	columns = ",".join(map(lambda meta: meta["name"], BUSINESS_META))
	variables = ",".join(map(lambda i: "${}".format(i + 1), range(len(BUSINESS_META))))

	sql = """
		INSERT INTO public.sba_disaster_loan_data({})
		VALUES ({})
	""".format(columns, variables)

	cursor.execute("PREPARE stmt AS {}".format(sql))

def deallocateStatement(cursor):
	cursor.execute("DEALLOCATE stmt")

def populateHazardids(cursor):
	cases = []
	for key in FEMA_DISASTER_TO_HAZARDID:
		cases.append("WHEN incidenttype = '{}' THEN '{}'\n".format(key, FEMA_DISASTER_TO_HAZARDID[key]))

	sql = """
		UPDATE public.sba_disaster_loan_data
		SET hazardid = (
			SELECT 
			  	CASE
			  		{}
					--WHEN incidenttype = 'X' THEN 'Y'
					ELSE NULL
			  	END
			FROM (SELECT incidenttype 
				FROM public.fema_disaster_declarations
				WHERE disasternumber::TEXT = fema_disaster_number) AS foo
		)
		WHERE fema_disaster_number IS NOT NULL
	""".format("".join(cases))

	print "STARTING POPULATION OF HAZARD IDs..."
	print "THIS COULD TAKE A FEW MINUTES..."

	cursor.execute(sql)

	print "COMPLETED POPULATION OF HAZARD IDs."

def populateFemaDates(cursor):
	sql = """
		UPDATE public.sba_disaster_loan_data
		SET fema_date = (
			SELECT incidentbegindate
			FROM public.fema_disaster_declarations
			WHERE disasternumber::TEXT = fema_disaster_number
		)
		WHERE fema_disaster_number IS NOT NULL
	"""

	print "STARTING POPULATION OF FEMA DATES..."
	print "THIS COULD TAKE A FEW MINUTES..."

	cursor.execute(sql)

	print "COMPLETED POPULATION OF FEMA DATES."

def populateStateGeoids(cursor):
	sql = """
		UPDATE public.sba_disaster_loan_data
		SET geoid = '36'
		WHERE lower(damaged_property_state_code) = 'ny'
		AND geoid IS NULL;
	"""
	cursor.execute(sql);
# END populateStateGeoids

def populateCountyGeoids(cursor):
	sql = """
		CREATE OR REPLACE FUNCTION temp(TEXT) RETURNS TEXT
			AS $$ SELECT geotl.geoid
			FROM geo.tl_2017_us_county AS geotl
			WHERE lower(geotl.name) = lower($1)
			AND geotl.statefp = '36'
			GROUP BY geotl.geoid $$
		LANGUAGE SQL
		IMMUTABLE
		RETURNS NULL ON NULL INPUT;

		UPDATE public.sba_disaster_loan_data
		SET geoid = temp(damaged_property_county_or_parish_name::TEXT)
		WHERE damaged_property_county_or_parish_name IS NOT NULL
		AND lower(damaged_property_state_code) = 'ny'
		AND geoid IS NULL;

		DROP FUNCTION temp(TEXT);
	"""
	cursor.execute(sql);
# END populateCountyGeoids

def populateCousubGeoids(cursor):
	sql = """
		CREATE OR REPLACE FUNCTION temp(TEXT) RETURNS TEXT
			AS $$ SELECT geotl.geoid
			FROM geo.tl_2017_36_cousub AS geotl
			WHERE lower(geotl.name) = lower($1)
			AND geotl.statefp = '36'
			GROUP BY geotl.geoid $$
		LANGUAGE SQL
		IMMUTABLE
		RETURNS NULL ON NULL INPUT;

		UPDATE public.sba_disaster_loan_data
		SET geoid = temp(damaged_property_city_name::TEXT)
		WHERE damaged_property_city_name IS NOT NULL
		AND lower(damaged_property_state_code) = 'ny'
		AND geoid IS NULL;

		DROP FUNCTION temp(TEXT);
	"""
	cursor.execute(sql)
# END populateCousubGeoids

def clearGeoids(cursor):
	sql = """
		UPDATE public.sba_disaster_loan_data
		SET geoid = NULL;
	"""
	cursor.execute(sql)

def populateGeoids(cursor):
	print "STARTING POPULATION OF GEO IDs..."

	clearGeoids(cursor)
	populateCousubGeoids(cursor)
	populateCountyGeoids(cursor)
	populateStateGeoids(cursor)
	
	print "COMPLETED POPULATION OF GEO IDs."
# END populateGeoids

def loadTable(cursor):

	inserts = ",".join(["%s"] * len(BUSINESS_META))
	sql = """
		EXECUTE stmt({})
	""".format(inserts)

	print "LOADING BUSINESS DATA..."
	firstLineRead = False
	META_DATA = []
	with open(BUSINESS_FILE, 'rb') as businessData:
		reader = csv.reader(businessData, delimiter=',', dialect='excel')
		for row in reader:
			if firstLineRead:
				row = map(convert, META_DATA, tryTransformRow(row))
				row.append("business")
				cursor.execute(sql, row)

			else:
				for i, column in enumerate(row):
					BUSINESS_META[i]["name"] = column.replace(" ", "_").replace("/", "_or_").lower()

				createTable(cursor)
				prepareStatement(cursor)

				META_DATA = BUSINESS_META[0:len(row)]
				firstLineRead = True
			# end if
		# end for
	# end with
	print "BUSINESS DATA LOADED."

	print "LOADING HOME DATA..."
	firstLineRead = False
	with open(HOME_FILE) as homeData:
		reader = csv.reader(homeData, delimiter=',', dialect='excel')
		for row in reader:
			if firstLineRead:
				row = map(convert, META_DATA, tryTransformRow(row))
				row.append(None)
				row.append("home")
				cursor.execute(sql, row)

			else:
				META_DATA = BUSINESS_META[0:len(row)]
				firstLineRead = True
			# end if
		# end for
	# end with
	print "HOME DATA LOADED."

	deallocateStatement(cursor)

def convertFile(inFile, outFile, inFormat, outFormat):
	with io.open(inFile, encoding=inFormat, buffering=1024) as in_fp:
		with io.open(outFile, 'w', encoding=outFormat) as out_fp:
			out_fp.write(in_fp.read())

def convertFiles(ucBusiness, businessIn, ucHome, homeIn, inFormat, outFormat, **rest):
	convertFile(ucBusiness, businessIn, inFormat, outFormat)
	convertFile(ucHome, homeIn, inFormat, outFormat)


parser = argparse.ArgumentParser(description='SBA Data Tools.')
parser.add_argument('-c', '--convert',
				action='store_true',
				default=False,
				dest='convert',
				help='Convert files before loading tables.')

parser.add_argument('-t', '--no-table',
				action='store_true',
				default=False,
				dest='noTable',
				help='Skip table population.')

parser.add_argument('-z', '--no-hazardids',
				action='store_true',
				default=False,
				dest='noHazardids',
				help='Skip population of hazardids.')

parser.add_argument('-d', '--no-dates',
				action='store_true',
				default=False,
				dest='noDates',
				help='Skip population of fema dates.')

parser.add_argument('-g', '--no-geoids',
				action='store_true',
				default=False,
				dest='noGeoids',
				help='Skip population of geoids.')

parser.add_argument('-u', '--unconverted-business',
				default=UNCONVERTED_BUSINESS_FILE,
				dest='ucBusiness', metavar='<URL>',
				help='URL for unconverted business file. Defaults to: {}.'.format(UNCONVERTED_BUSINESS_FILE))
parser.add_argument('-b', '--business-in',
				default=BUSINESS_FILE,
				dest='businessIn', metavar='<URL>',
				help='URL for input business file. When converting, this file will become the output of the converter. Defaults to: {}.'.format(BUSINESS_FILE))

parser.add_argument('-n', '--unconverted-home',
				default=UNCONVERTED_HOME_FILE,
				dest='ucHome', metavar='<URL>',
				help='URL for unconverted home file. Defaults to: {}.'.format(UNCONVERTED_HOME_FILE))
parser.add_argument('-m', '--home-in',
				default=HOME_FILE,
				dest='homeIn', metavar='<URL>',
				help='URL for input home file. When converting, this file will become the output of the converter. Defaults to: {}.'.format(HOME_FILE))

DEFAULT_INPUT_FORMAT = 'utf-8-sig'
parser.add_argument('-i', '--input-format',
				default=DEFAULT_INPUT_FORMAT,
				dest='inFormat', metavar='<FORMAT>',
				help="Input file encoding used when converting. Defaults to: '{}'.".format(DEFAULT_INPUT_FORMAT))
DEFAULT_OUTPUT_FORMAT = 'utf-8'
parser.add_argument('-o', '--output-format',
				default=DEFAULT_OUTPUT_FORMAT,
				dest='outFormat', metavar='<FORMAT>',
				help="Output file encoding used when converting. Defaults to: '{}'.".format(DEFAULT_OUTPUT_FORMAT))

def main():
	args = vars(parser.parse_args())

	conn = psycopg2.connect(host)
	cursor = conn.cursor()

	if args["convert"]:
		convertFiles(**args)

	if not args["noTable"]:
		loadTable(cursor)
		conn.commit()

	if not args["noHazardids"]:
		populateHazardids(cursor)
		conn.commit()

	if not args["noDates"]:
		populateFemaDates(cursor)
		conn.commit()

	if not args["noGeoids"]:
		populateGeoids(cursor)
		conn.commit()

	cursor.close()
	conn.close()

if __name__ == "__main__":
	main()
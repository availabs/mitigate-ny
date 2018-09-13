import argparse, csv, os, psycopg2, re, requests
from urllib import quote

from config import host, app_id, app_code

CSV_FILE = 'nfip.csv'

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

def toBoolean(string):
	try:
		string = string.strip().lower()
		if len(string) is 0:
			return False
		if (string == 'x') or (string == 'yes'):
			return True
		else:
			return False
	except:
		print "toBoolean ERROR:", string
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
# END toString

def toInt(string):
	try:
		string = string.strip()
		if len(string) is 0:
			return None
		return int(string)
	except:
		print "toInt ERROR:", string
		return None
# END toString

META = [
	{ "column": None, "type": "VARCHAR", "convert": toString }, #State Name
	{ "column": None, "type": "VARCHAR", "convert": toString }, #Community Name
	{ "column": None, "type": "VARCHAR", "convert": toString }, #Comm Nbr
	{ "column": None, "type": "VARCHAR", "convert": toString }, #Prop Locatr

	{ "column": None, "type": "BOOLEAN", "convert": toBoolean }, #Mitigated?
	{ "column": None, "type": "BOOLEAN", "convert": toBoolean }, #Insured?

	{ "column": None, "type": "VARCHAR", "convert": toString }, #Address Line 1

	{ "column": None, "type": "VARCHAR", "convert": toString }, #Address Line 2
	{ "column": None, "type": "VARCHAR", "convert": toString }, #City
	{ "column": None, "type": "VARCHAR", "convert": toString }, #State
	{ "column": None, "type": "VARCHAR", "convert": toString }, #Zip Code

	{ "column": None, "type": "VARCHAR", "convert": toString }, #Prior Address Line 1
	{ "column": None, "type": "VARCHAR", "convert": toString }, #Prior Address Line 2
	{ "column": None, "type": "VARCHAR", "convert": toString }, #Prior City
	{ "column": None, "type": "VARCHAR", "convert": toString }, #Prior State
	{ "column": None, "type": "VARCHAR", "convert": toString }, #Prior Zip Code
	{ "column": None, "type": "VARCHAR", "convert": toString }, #Prior Comm Nbr
	{ "column": None, "type": "VARCHAR", "convert": toString }, #Insureds Name
	{ "column": None, "type": "VARCHAR", "convert": toString }, #Last Claimant

	{ "column": None, "type": "BOOLEAN", "convert": toBoolean }, #NOTSPECSW
	{ "column": None, "type": "BOOLEAN", "convert": toBoolean }, #NOBLDGSW
	{ "column": None, "type": "BOOLEAN", "convert": toBoolean }, #FLOODPRSW
	{ "column": None, "type": "BOOLEAN", "convert": toBoolean }, #GT100SW
	{ "column": None, "type": "BOOLEAN", "convert": toBoolean }, #UNABLIDSW

	{ "column": None, "type": "VARCHAR", "convert": toString }, #BOX_1_SW
	{ "column": None, "type": "VARCHAR", "convert": toString }, #BOX_2_SW
	{ "column": None, "type": "VARCHAR", "convert": toString }, #BOX_3_SW
	{ "column": None, "type": "VARCHAR", "convert": toString }, #BOX_4_SW
	{ "column": None, "type": "VARCHAR", "convert": toString }, #HISTBLDGSW

	# { "column": None, "type": "VARCHAR", "convert": toString }, #Dt of Loss
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Occupancy
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Zone
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Firm
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Building Payment
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Contents Payment

	{ "column": None, "type": "NUMERIC", "convert": toFloat }, #Building Value

	# { "column": None, "type": "VARCHAR", "convert": toString }, #Dt of Loss
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Occupancy
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Zone
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Firm
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Building Payment
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Contents Payment

	# { "column": None, "type": "VARCHAR", "convert": toString }, #Dt of Loss
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Occupancy
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Zone
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Firm
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Building Payment
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Contents Payment

	# { "column": None, "type": "VARCHAR", "convert": toString }, #Dt of Loss
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Occupancy
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Zone
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Firm
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Building Payment
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Contents Payment

	# { "column": None, "type": "VARCHAR", "convert": toString }, #Dt of Loss
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Occupancy
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Zone
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Firm
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Building Payment
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Contents Payment

	# { "column": None, "type": "VARCHAR", "convert": toString }, #Dt of Loss
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Occupancy
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Zone
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Firm
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Building Payment
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Contents Payment

	# { "column": None, "type": "VARCHAR", "convert": toString }, #Dt of Loss
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Occupancy
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Zone
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Firm
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Building Payment
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Contents Payment

	# { "column": None, "type": "VARCHAR", "convert": toString }, #Dt of Loss
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Occupancy
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Zone
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Firm
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Building Payment
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Contents Payment

	# { "column": None, "type": "VARCHAR", "convert": toString }, #Dt of Loss
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Occupancy
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Zone
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Firm
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Building Payment
	# { "column": None, "type": "VARCHAR", "convert": toString }, #Contents Payment

	{ "column": None, "type": "NUMERIC", "convert": toFloat }, #Tot Building Payment
	{ "column": None, "type": "NUMERIC", "convert": toFloat }, #Tot Contents Payment
	{ "column": None, "type": "INTEGER", "convert": toInt }, #Losses
	{ "column": None, "type": "NUMERIC", "convert": toFloat }, #Total Paid
	{ "column": None, "type": "NUMERIC", "convert": toFloat }, #Average Pay
	{ "column": None, "type": "VARCHAR", "convert": toString }, #Data Type
	{ "column": None, "type": "DATE", "convert": toString }, #As of Date
	{ "column": None, "type": "VARCHAR", "convert": toString }, #Local Property Identifier
	{ "column": None, "type": "VARCHAR", "convert": toString }, #County Name
	{ "column": None, "type": "VARCHAR", "convert": toString }, #County Nbr
	{ "column": None, "type": "VARCHAR", "convert": toString }, #SRL Indicator
]

def sliceRow(row):
	return row[0 : 29] + row[35 : 36] + row[84 : 95]

def makeColumnName(string):
	return "_".join(string.lower().replace("?", "").split(" "))

def fillColumns(row):
	for i, column in enumerate(row):
		META[i]["column"] = makeColumnName(column)

def makeAddress(args):
	return quote(",".join([arg for arg in args if bool(arg)]))

def getGeocode(args):
	url = "https://geocoder.api.here.com/6.2/geocode.json"
	url += "?app_id={}".format(app_id)
	url += "&app_code={}".format(app_code)
	url += "&searchtext={}".format(makeAddress(args))

	response = requests.get(url)

	views = response.json()["Response"]["View"]
	for view in views:
		results = view["Result"]
		for result in results:
			location = result["Location"]

			lon = location["DisplayPosition"]["Longitude"]
			lat = location["DisplayPosition"]["Latitude"]

			if lon and lat:
				print "<getGeocode> Returning [{}, {}].".format(lon, lat)
				return [lon, lat]
			# END if lon and lat
		# END for result in results
	# END for view in views

	print "<getGeocode> Returning [None, None]."
	return [None, None]

def convert(meta, v):
	return meta["convert"](v)
# END convert

def createTable(cursor):
	print "\nCREATING TABLE..."
	sql = """
		DROP TABLE IF EXISTS public.nfip;
		CREATE TABLE public.nfip (
			{},
			longitude NUMERIC,
			latitude NUMERIC,
			geoid VARCHAR(11) DEFAULT NULL,
			cousub_geoid VARCHAR(10) DEFAULT NULL
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
		INSERT INTO public.nfip({},longitude,latitude)
		VALUES ({},{},{})
	""".format(columns, variables, "${}".format(len(META)+1), "${}".format(len(META)+2))
	cursor.execute("PREPARE stmt AS {}".format(sql))
# END prepareStatement

def deallocateStatement(cursor):
	cursor.execute("DEALLOCATE stmt")
# END deallocateStatement

def loadCsvData(cursor, inputUrl, **rest):

	inserts = ",".join(["%s" for meta in META])
	sql = """
		EXECUTE stmt({},%s,%s)
	""".format(inserts)

	print 'LOADING CSV DATA "{}"...'.format(inputUrl)

	firstLineRead = False
	try:
		with open(inputUrl, 'rb') as data:
			reader = csv.reader(data, delimiter=',')
			for row in reader:
				if firstLineRead:
					row = map(convert, META, sliceRow(row))
					lonLat = getGeocode(row[7:11])
					cursor.execute(sql, row + lonLat)
				else:
					fillColumns(sliceRow(row))
					createTable(cursor)
					prepareStatement(cursor)
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
		ALTER TABLE public.nfip
		DROP COLUMN IF EXISTS geoid,
		DROP COLUMN IF EXISTS cousub_geoid;

		ALTER TABLE public.nfip
		ADD COLUMN geoid VARCHAR(11) DEFAULT NULL,
		ADD COLUMN cousub_geoid VARCHAR(10) DEFAULT NULL;
	"""
	cursor.execute(sql);
	print "CREATED COLUMNS. \n"

	print "STARTING GEOID FIRST PASS..."
	print "THIS WILL TAKE AWHILE..."
	sql = """
		UPDATE public.nfip AS nfip
		SET geoid = (
			SELECT geotl.geoid
			FROM geo.tl_2017_tract AS geotl
			WHERE ST_Contains(
				geotl.geom, ST_Transform(
								ST_SetSrid(
									ST_MakePoint(nfip.longitude, nfip.latitude)
								, 4326)
							, 4269)
						)
		)
		WHERE geoid IS NULL
		AND longitude IS NOT NULL
		AND latitude IS NOT NULL;
	"""
	cursor.execute(sql);
	print "COMPLETED GEOID FIRST PASS.\n"

	print "STARTIG COUSUB GEOID FIRST PASS..."
	print "THIS WILL TAKE AWHILE..."
	sql = """
		UPDATE public.nfip AS nfip
		SET cousub_geoid = (
			SELECT geotl.geoid
			FROM geo.tl_2017_cousub AS geotl
			WHERE ST_Contains(
				geotl.geom, ST_Transform(
								ST_SetSrid(
									ST_MakePoint(nfip.longitude, nfip.latitude)
								, 4326)
							, 4269)
						)
		)
		WHERE cousub_geoid IS NULL
		AND longitude IS NOT NULL
		AND latitude IS NOT NULL;
	"""
	cursor.execute(sql);
	print "COMPLETED COUSUB GEOID FIRST PASS.\n"
# END addGeoids

parser = argparse.ArgumentParser(description='OGS CSV table loader.')

parser.add_argument('-i', '--input-url',
				dest='inputUrl',
				default=CSV_FILE,
				metavar='<Input URL>',
				help='URL for .csv input file. Defaults to {}.'.format(CSV_FILE))

parser.add_argument('-l', '--no-load',
				action='store_true',
				default=False,
				dest='noLoad',
				help='Skip creation of nfip table and csv data loading. Defaults to false.')

def main():
	args = vars(parser.parse_args())

	connection = psycopg2.connect(host)
	cursor = connection.cursor()

	if not args["noLoad"]:
		loadCsvData(cursor, **args)
		connection.commit()

	addGeoids(cursor)
	connection.commit()

	cursor.close()
	connection.close()
# END main

if __name__ == "__main__":
	main()
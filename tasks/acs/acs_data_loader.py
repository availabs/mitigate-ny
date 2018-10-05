import argparse, csv, os, psycopg2, re, requests
from urllib import quote

from config import host, CENSUS_DATA_API_KEY

EARLIEST_DATA_YEAR = 2009
LATEST_DATA_YEAR = 2016
AVAILABLE_DATA_YEARS = range(EARLIEST_DATA_YEAR, LATEST_DATA_YEAR + 1)

GEO_LEVELS = ['state', 'county', 'cousub', 'tract']

CENSUS_API_VARIABLES_BY_GROUP = [
	{ "name": "population",
		"variables": [
			'B01003_001E'	# total population
		]
	},

	{ "name": "poverty",
		"variables": [
			'B16009_001E'	# total population at poverty level
		]
	},

	{ "name": "non_english_speaking",
		"variables": [
			'B06007_005E'	# total population that speaks english less than "very well"
		]
	},

	{ "name": "under_5",
		"variables": [
			'B01001_003E',	# males under 5
			'B01001_027E'		# females under 5
		]
	},

	{ "name": "over_64",
		"variables": [
			'B01001_020E',	# males 65 & 66
			'B01001_021E',	# males 67 - 69
			'B01001_022E',	# males 70 - 74
			'B01001_023E',	# males 75 - 79
			'B01001_024E',	# males 80 - 84
			'B01001_025E',	# males 85+
			'B01001_044E',	# females 65 & 66
			'B01001_045E',	# females 67 - 69
			'B01001_046E',	# females 70 - 74
			'B01001_047E',	# females 75 - 79
			'B01001_048E',	# females 80 - 84
			'B01001_049E'		# females 85+
		]
	}
]
CENSUS_API_VARIABLE_NAMES = [];
CENSUS_API_VARIABLES = [];
# used to slice API response row and sum required variables
CENSUS_API_SLICES = {};
# EXAMPLE SLICE: { "under_5": [3, 5] }

count = 0;
for group in CENSUS_API_VARIABLES_BY_GROUP:
	CENSUS_API_VARIABLE_NAMES.append(group["name"])
	CENSUS_API_VARIABLES.extend(group["variables"])
	length = len(group["variables"])
	CENSUS_API_SLICES[group["name"]] = [count, count + length]
	count += length

def makeBaseUrl(year):
	if year not in AVAILABLE_DATA_YEARS:
		return None

	addon = ''
	if year > 2014:
		addon = 'acs/'

	return """https://api.census.gov/data/{}/{}acs5?key={}&get={}""".format(year, addon, CENSUS_DATA_API_KEY, ",".join(CENSUS_API_VARIABLES))

def makeUrl(year, geoLevel):
	url = makeBaseUrl(year)

	if url is not None:
		if geoLevel is 'state':
			url += '&for=state:36'
		elif geoLevel is 'county':
			url += '&for=county:*&in=state:36'
		elif geoLevel is 'cousub':
			url += '&for=county+subdivision:*&in=state:36'
		elif geoLevel is 'tract':
			url += '&for=tract:*&in=state:36'

	return url

def prepareStatement(cursor):
	columns = ",".join(CENSUS_API_VARIABLE_NAMES)
	variables = ",".join(['$' + str(i + 1) for i in range(len(CENSUS_API_VARIABLE_NAMES) + 2)])

	sql = """
		INSERT INTO public.acs_data({}, geoid, year)
		VALUES ({})
	""".format(columns, variables)
	cursor.execute("PREPARE stmt AS {}".format(sql))
# END prepareStatement

def deallocateStatement(cursor):
	cursor.execute("DEALLOCATE stmt")
# END deallocateStatement

def downloadAcsData(cursor):
	print "DOWNLOADING ACS DATA..."
	print "THIS WILL TAKE SOME TIME..."
	prepareStatement(cursor)

	inserts = ",".join(["%s" for i in range(len(CENSUS_API_VARIABLE_NAMES) + 2)])
	sql = """
		EXECUTE stmt({})
	""".format(inserts)

	for year in AVAILABLE_DATA_YEARS:
		for geoLevel in GEO_LEVELS:
			response = requests.get(makeUrl(year, geoLevel))

			for row in response.json()[1:]:
				geoid = "".join(row[len(CENSUS_API_VARIABLES):])

				values = [sum([int(r) for r in row[CENSUS_API_SLICES[name][0]:CENSUS_API_SLICES[name][1]]]) for name in CENSUS_API_VARIABLE_NAMES]
				values.extend([geoid, year])

				cursor.execute(sql, values)

	deallocateStatement(cursor)
	print "ACS DATA DOWNLOADED.\n"

def createTable(cursor):
	print "CREATING TABLE..."
	sql = """
		DROP TABLE IF EXISTS public.acs_data;
		CREATE TABLE public.acs_data (
			geoid VARCHAR(11),
			year INT,
			population INT,
			poverty INT,
			under_5 INT,
			over_64 INT,
			non_english_speaking INT
		)
	"""
	cursor.execute(sql);
	print "TABLE CREATED.\n"
# END createTable

def main():
	connection = psycopg2.connect(host)
	cursor = connection.cursor()

	createTable(cursor)
	connection.commit()

	downloadAcsData(cursor)
	connection.commit()

	cursor.close()
	connection.close()
# END main

if __name__ == "__main__":
	main()
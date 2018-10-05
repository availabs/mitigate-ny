import argparse, csv, os, psycopg2, re

from config import host

HOME_DIR = os.environ['HOME']

HAZARDS = [
    'wind',
    'wildfire',
    'tsunami',
    'tornado',
    'riverine',
    'lightning',
    'landslide',
    'icestorm',
    'hurricane',
    'heatwave',
    'hail',
    'earthquake',
    'drought',
    'avalanche',
    'coldwave',
    'winterweat',
    'volcano',
    'coastal'
]

class HazardException(Exception):
	def __init__(self, hazards):
		message = "List of hazards included bad id: {}.".format(hazards)
		super(HazardException, self).__init__(message)

def mapHazards(string):
	try:
		string = string.strip().lower()
		if len(string) is 0:
			return None
		if (string == "all") or (string == "all hazards"):
			return "|".join(HAZARDS)
		hazards = [s.strip() for s in string.split(",")]
		if len(hazards) == 1:
			hazards = [s.strip() for s in string.split("|")]
		if not reduce(lambda a, c: a and (c in HAZARDS), hazards, True):
			raise HazardException(string)
		return "|".join(hazards)
	except Exception as e:
		print "mapHazards ERROR:", string
		raise e

def toString(string):
	try:
		if string is None:
			return None
		string = string.strip()
		if len(string) is 0:
			return None
		return string
	except Exception as e:
		print "toString ERROR:", string
		raise e

def toBoolean(string):
	try:
		if string is None:
			return False
		string = string.strip().lower()
		return string == 'x'
	except Exception as e:
		print "toBoolean ERROR:", string
		raise e

TYPES = [
	'program',
	'measure',
	'action'
]

class TypeException(Exception):
	def __init__(self, t):
		message = "Bad type: {}.".format(t)
		super(TypeException, self).__init__(message)

def toType(string):
	try:
		if string is None or len(string) is 0:
			string = 'program'
		string = string.strip().lower()
		if not string in TYPES:
			raise TypeException(string)
		return string
	except Exception as e:
		print "toType ERROR:", string
		raise e

def convert(meta, v):
	try:
		return meta["convert"](v)
	except Exception as e:
		print e, "\n"
		raise e

META = [
	{ "column": "name",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "description",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "contact",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "contact_email",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "contact_title",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "contact_department",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "agency",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "partners",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "status_new_shmp",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "status_carryover_shmp",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "status_in_progess",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "status_on_going",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "status_unchanged",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "status_completed",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "status_discontinued",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "admin_statewide",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "admin_regional",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "admin_county",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "admin_local",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "file_type_shp",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "file_type_lat_lon",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "file_type_address",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "file_type_not_tracked",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "budget_provided",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "primary_funding",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "secondary_funding",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "num_staff",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "num_contract_staff",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "hazards",
		"type": "VARCHAR",
		"convert": mapHazards },

	{ "column": "capability_mitigation",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "capability_preparedness",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "capability_response",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "capability_recovery",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "capability_climate",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "capability_critical",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "capability_preservation",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "capability_environmental",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "capability_risk_assessment",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "capability_administer_funding",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "funding_amount",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "capability_tech_support",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "capability_construction",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "capability_outreach",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "capability_project_management",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "capability_research",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "capability_policy",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "capability_regulatory",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "column": "related_policy",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "url",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "goal",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "objective",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "priority",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "priority_1",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "priority_2",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "priority_3",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "priority_4",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "priority_5",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "priority_6",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "priority_7",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "priority_total",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "benefit_cost_analysis",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "engineering_required",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "engineering_complete",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "type",
		"type": "VARCHAR",
		"convert": toType },

	{ "column": "municipality",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "county",
		"type": "VARCHAR",
		"convert": toString },

	{ "column": "capability_resiliency",
		"type": "BOOLEAN",
		"convert": toBoolean }
]

def createTable(cursor):
	print "CREATING TABLE..."
	sql = """
		DROP TABLE IF EXISTS public.capabilities;
		CREATE TABLE public.capabilities (
			{},
			id SERIAL PRIMARY KEY,
			created_at TIMESTAMP DEFAULT NOW(),
			updated_at TIMESTAMP DEFAULT NOW()
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
		INSERT INTO public.capabilities({})
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

def loadCsvData(cursor, inputUrl):
	if not prepareStatement(cursor):
		return False

	inserts = ",".join(["%s" for meta in META])
	sql = """
		EXECUTE stmt({})
	""".format(inserts)

	print 'LOADING CSV DATA "{}"...'.format(inputUrl)

	firstLineRead = False

	rows = []
	CONVERT_ERRORS = 0

	with open(inputUrl, 'rb') as data:
		reader = csv.reader(data, delimiter=',')
		for row in reader:
			if firstLineRead:
				try:
					rows.append(map(convert, META, row))
				except:
					CONVERT_ERRORS += 1
			else:
				firstLineRead = True
			# end if
		# end for
	# end with

	if CONVERT_ERRORS > 0:
		print "CSV DATA WAS NOT LOADED.\n"
	else:
		for row in rows:
			cursor.execute(sql, row)
		print "CSV DATA LOADED.\n"

	deallocateStatement(cursor)
	return CONVERT_ERRORS == 0
# END loadCsvData

parser = argparse.ArgumentParser(description='Capabilities CSV table loader.')

parser.add_argument('inputUrl',
				nargs="+",
				default=None,
				metavar='<Input URL>',
				help='URL for CSV input file(s).')

parser.add_argument('-t', '--create-table',
				default=False,
				action='store_true',
				dest='createTable',
				help='Toggle table creation on. Defaults to false (no table creation).')

def main():
	args = vars(parser.parse_args())

	connection = psycopg2.connect(host)
	cursor = connection.cursor()

	if args["createTable"]:
		createTable(cursor)
		connection.commit()

	for inputUrl in args["inputUrl"]:
		if os.path.isdir(inputUrl):
			files = [os.path.join(inputUrl, file) for file in os.listdir(inputUrl) if os.path.isfile(os.path.join(inputUrl, file))]
			for file in files:
				if loadCsvData(cursor, file):
					connection.commit()
		elif os.path.isfile(inputUrl):
			if loadCsvData(cursor, inputUrl):
				connection.commit()

	cursor.close()
	connection.close()
# END main

if __name__ == "__main__":
	main()
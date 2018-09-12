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
	string = string.strip()
	if len(string) is 0:
		return None
	if string.lower() == "all":
		return HAZARDS
	hazards = [s.strip() for s in string.split(",")]
	if not reduce(lambda a, c: a and (c in HAZARDS), hazards, True):
		raise HazardException(string)
	return hazards

BUDGET_REGEX = '[$]*(\d+)([kKmMbBtT])'
def budgetToInt(string):
	string = string.strip()
	try:
		if len(string) is 0:
			return None
		m = re.search(BUDGET_REGEX, string)
		if m is not None:
			dollars = m.group(1)
			mult = m.group(2)
			if dollars and mult:
				dollars = int(dollars)
				mult = mult.lower()
				if mult == 'k':
					return dollars * 1000
				elif mult == 'm':
					return dollars * 1000000
				elif mult == 'b':
					return dollars * 1000000000
				elif mult == 't':
					return dollars * 1000000000000
			elif dollars:
				return int(dollars)
			else:
				return None
		else:
			return None
	except:
		print "budgetToInt ERROR:", string
		return None

def toInt(string):
	string = string.strip()
	try:
		if len(string) is 0:
			return None
		return int(string)
	except:
		print "toInt ERROR:", string
		return None

def toString(string):
	string = string.strip()
	try:
		if len(string) is 0:
			return None
		return string
	except:
		print "toString ERROR:", string
		return None

def toBoolean(string):
	string = string.strip()
	try:
		return string.lower() == 'x'
	except:
		print "toBoolean ERROR:", string
		return None

def convert(meta, v):
	return meta["convert"](v)

META = [
	{ "csvName": "Program Name",
		"column": "name",
		"type": "VARCHAR",
		"convert": toString },

	{ "csvName": "Program Description",
		"column": "description",
		"type": "VARCHAR",
		"convert": toString },

	{ "csvName": "Program Lead Contact Name",
		"column": "contact",
		"type": "VARCHAR",
		"convert": toString },

	{ "csvName": "Lead Contact E-mail Address",
		"column": "contact_email",
		"type": "VARCHAR",
		"convert": toString },

	{ "csvName": "Lead Contact Title/Role",
		"column": "contact_title",
		"type": "VARCHAR",
		"convert": toString },

	{ "csvName": "Lead Contact Department/Division/Office",
		"column": "contact_department",
		"type": "VARCHAR",
		"convert": toString },

	{ "csvName": "Program Lead Agency",
		"column": "agency",
		"type": "VARCHAR",
		"convert": toString },

	{ "csvName": "Agency Partner(s)",
		"column": "partners",
		"type": "VARCHAR",
		"convert": toString },

	{ "csvName": "Status-New SHMP",
		"column": "status_new_shmp",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Status-Carryover SHMP",
		"column": "status_carryover_shmp",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Status-In Progress",
		"column": "status_in_progess",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Status-On-going",
		"column": "status_on_going",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Status-Unchanged",
		"column": "status_unchanged",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Status-Completed",
		"column": "status_completed",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Status-Discontinued",
		"column": "status_discontinued",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Administered-Statewide",
		"column": "admin_statewide",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Administered-Regional",
		"column": "admin_regional",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Administered-County",
		"column": "admin_county",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Administered-Local",
		"column": "admin_local",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "FileType-shp",
		"column": "file_type_shp",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "FileType-lat/long .csv / excel",
		"column": "file_type_lat_lon",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "FileType-geo/address .csv / excel",
		"column": "file_type_address",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "FileType-not tracked",
		"column": "file_type_not_tracked",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Budget provided to run the Program",
		"column": "budget_provided",
		"type": "VARCHAR",
		"convert": toString },

	{ "csvName": "Primary Source Funding the Program",
		"column": "primary_funding",
		"type": "VARCHAR",
		"convert": toString },

	{ "csvName": "Secondary Source Funding the Program",
		"column": "secondary_funding",
		"type": "VARCHAR",
		"convert": toString },

	{ "csvName": "Approximate # of Staff Assigned FTE",
		"column": "num_staff",
		"type": "INT",
		"convert": toInt },

	{ "csvName": "Approximate # Contract Staff (if applicable)",
		"column": "num_contract_staff",
		"type": "INT",
		"convert": toInt },

	{ "csvName": "Associated Hazards",
		"column": "hazards",
		"type": "VARCHAR[]",
		"convert": mapHazards },

	{ "csvName": "Capability-Mitigation",
		"column": "capability_mitigation",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Preparedness",
		"column": "capability_preparedness",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Response",
		"column": "capability_response",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Recovery",
		"column": "capability_recovery",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Climate Related",
		"column": "capability_climate",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Critical Facilities",
		"column": "capability_critical",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Historic Preservation",
		"column": "capability_preservation",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Environmental Protection",
		"column": "capability_environmental",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Risk Assessment",
		"column": "capability_risk_assessment",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Administer Funding",
		"column": "capability_administer_funding",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Funding Amount",
		"column": "capability_funding_amount",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Technical Support",
		"column": "capability_tech_support",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Construction",
		"column": "capability_construction",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Education/ Outreach",
		"column": "capability_outreach",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Project Management",
		"column": "capability_project_management",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Research",
		"column": "capability_research",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Policy Framework",
		"column": "capability_policy",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Capability-Regulatory",
		"column": "capability_regulatory",
		"type": "BOOLEAN",
		"convert": toBoolean },

	{ "csvName": "Related Regulation or Policy",
		"column": "related_policy",
		"type": "VARCHAR",
		"convert": toString },

	{ "csvName": "Program WebURL",
		"column": "url",
		"type": "VARCHAR",
		"convert": toString },

	{ "csvName": "Goal",
		"column": "goal",
		"type": "VARCHAR",
		"convert": toString },

	{ "csvName": "Objective",
		"column": "objective",
		"type": "VARCHAR",
		"convert": toString }
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
					row = map(convert, META, row)
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
				loadCsvData(cursor, file)
				connection.commit()
		elif os.path.isfile(inputUrl):
			loadCsvData(cursor, inputUrl)
			connection.commit()

	cursor.close()
	connection.close()
# END main

if __name__ == "__main__":
	main()
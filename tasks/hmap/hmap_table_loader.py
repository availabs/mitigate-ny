import argparse, csv, os, psycopg2

from config import host

HOME_DIR = os.environ['HOME']

HMAP_FILE = HOME_DIR + "/Downloads/HazardMitigationAssistanceProjects.csv"

def toFloat(string):
	try:
		if len(string) is 0:
			return None
		return float(string.replace(",", ""))
	except:
		print "toFloat ERROR:", string
		return None

def toString(string):
	try:
		if len(string) is 0:
			return None
		return string
	except:
		print "toString ERROR:", string
		return None

def toInt(string):
	try:
		if len(string) is 0:
			return None
		return int(string)
	except:
		print "toInt ERROR:", string
		return None

def zfillString(string, num):
	try:
		if len(string) is 0:
			return None
		return string.zfill(num)
	except:
		print "zfillString ERROR:", string
		return None

def toState(string):
	return zfillString(string, 2)
def toCounty(string):
	return zfillString(string, 3)

def convert(meta, v):
	return meta["convert"](v)

BUSINESS_META = [
	{ "convert": toString,	"type": "VARCHAR" },

	{ "convert": toString,	"type": "VARCHAR" },

	{ "convert": toState,	"type": "VARCHAR" },
	{ "convert": toString,	"type": "VARCHAR" },

	{ "convert": toCounty,	"type": "VARCHAR" },
	{ "convert": toString,	"type": "VARCHAR" },

	{ "convert": toString,	"type": "VARCHAR" },
	{ "convert": toString,	"type": "VARCHAR" },
	{ "convert": toString,	"type": "VARCHAR" },
	{ "convert": toString,	"type": "VARCHAR" },
	{ "convert": toString,	"type": "VARCHAR" },

	{ "convert": toInt,		"type": "INTEGER" },
	{ "convert": toInt,		"type": "INTEGER" },

	{ "convert": toString,	"type": "VARCHAR" },
	{ "convert": toString,	"type": "VARCHAR" },

	{ "convert": toFloat,	"type": "NUMERIC" },
	{ "convert": toFloat,	"type": "NUMERIC" },
	{ "convert": toFloat,	"type": "NUMERIC" },

	{ "convert": toInt,		"type": "INTEGER" },

	{ "convert": toString,	"type": "TIMESTAMP" },
	{ "convert": toString,	"type": "TIMESTAMP" },
	{ "convert": toString,	"type": "TIMESTAMP" },

	{ "convert": toString,	"type": "VARCHAR" },
	{ "convert": toString,	"type": "VARCHAR" }
]

def createTable(cursor):
	sql = """
		DROP TABLE IF EXISTS public.sba_disaster_loan_data;

		CREATE TABLE public.sba_disaster_loan_data (
			{},

			incidenttype VARCHAR DEFAULT NULL,
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

def loadTable(cursor, input):


parser = argparse.ArgumentParser(description='HMAP table loader.')

parser.add_argument('-i', '--input-url',
				default=HMAP_FILE,
				dest='ucBusiness', metavar='<URL>',
				help='URL for HMAP input file. Defaults to: {}.'.format(HMAP_FILE))

def main():
	args = vars(parser.parse_args())

	conn = psycopg2.connect(host)
	cursor = conn.cursor()

	# if not args["noTable"]:
	# 	loadTable(cursor)
	# 	conn.commit()

	cursor.close()
	conn.close()

if __name__ == "__main__":
	main()
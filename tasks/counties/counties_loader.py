import argparse, csv, os, psycopg2, re

from config import host

CSV_FILE = 'county_plan_status.csv'

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

def toDate(string):
	try:
		string = string.strip()
		if len(string) is 0:
			return None
		if string == 'No Current Plan':
			return None
		return string
	except Exception as e:
		print "toDate ERROR:", string, e
		return None

META = [
	{ "column": "fips",				"type": "VARCHAR(5)",	"convert": toString },
	{ "column": "plan_consultant",	"type": "VARCHAR",		"convert": toString },
	{ "column": "plan_expiration",	"type": "DATE",			"convert": toDate },
	{ "column": "plan_grant",		"type": "VARCHAR",		"convert": toString },
	{ "column": "plan_url",			"type": "VARCHAR",		"convert": toString }
]

def convert(meta, v):
	return meta["convert"](v)
# END convert

def createTable(cursor):
	print "CREATING TABLE..."
	sql = """
		DROP TABLE IF EXISTS public.county_plan_status;
		CREATE TABLE public.county_plan_status (
			{},
			CONSTRAINT county_plan_status_pkey PRIMARY KEY(fips)
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
		INSERT INTO public.county_plan_status({})
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
	return [row[0], row[2], row[3], row[4], row[12]]
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

	cursor.close()
	connection.close()
# END main

if __name__ == "__main__":
	main()
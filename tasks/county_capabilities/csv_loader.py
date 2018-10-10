import argparse, csv, os, psycopg2, re

from config import host

def createTable(cursor):
	sql = """
		DROP TABLE IF EXISTS public.county_capabilities;
		CREATE TABLE public.county_capabilities(
			type TEXT,
			sub_type TEXT,
			description TEXT,
			geoid VARCHAR(5),
			value NUMERIC default NULL
		)
	"""
	cursor.execute(sql)
# END createTable

def prepareStatement(cursor):
	sql = """
		INSERT INTO public.county_capabilities(type,sub_type,description,geoid,value)
		VALUES ($1,$2,$3,$4,$5)
	"""
	cursor.execute("PREPARE stmt AS {}".format(sql))
# END prepareStatement

def deallocateStatement(cursor):
	cursor.execute("DEALLOCATE stmt")
# END deallocateStatement

def loadCsvData(cursor, inputUrl="county_capabilities.csv"):
	print "LOADING CSV DATA..."
	prepareStatement(cursor)
	sql = """
		EXECUTE stmt(%s,%s,%s,%s,%s)
	"""
	firstLineRead = False
	secondLineRead = False

	rows = []
	ERRORS = 0

	geoids = []

	with open(inputUrl, 'rb') as data:
		reader = csv.reader(data, delimiter=',')
		for row in reader:
			if firstLineRead and secondLineRead:
				try:
					# rows.append(map(convert, META, row))
					code = row[3].lower()
					values = row[0:3]
					for i, geoid in enumerate(geoids):
						if row[i + 4].strip() != "":
							table_row = values[0:] + [geoid, None]
							if code == '$' and row[i + 4].lower() != 'x':
								table_row[4] = row[i + 4]
							rows.append(table_row)

				except:
					ERRORS += 1
			elif not firstLineRead:
				firstLineRead = True
				geoids = row[4:]
			elif not secondLineRead:
				secondLineRead = True
			# end if
		# end for
	# end with

	if ERRORS > 0:
		print "CSV DATA WAS NOT LOADED.\n"
	else:
		for row in rows:
			cursor.execute(sql, row)
		print "CSV DATA LOADED.\n"
	deallocateStatement(cursor)
	return ERRORS == 0

def main():
	connection = psycopg2.connect(host)
	cursor = connection.cursor()

	createTable(cursor)
	connection.commit()

	loadCsvData(cursor)
	connection.commit()

	cursor.close()
	connection.close()
# END main

if __name__ == "__main__":
	main()
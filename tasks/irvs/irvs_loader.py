import argparse, csv, os, psycopg2, re

from config import host

CSV_FILE = 'irvs_meta.csv'

def createBuildingDataTable(cursor, columns):
	pass
	sql = '''
		DROP TABLE IF EXISTS irvs.building_data;
		CREATE table irvs.building_data(
			{}
		)
	'''.format(", ".join([c + " TEXT" for c in columns]))
	cursor.execute(sql)

def createNameTable(cursor):
	sql = '''
		DROP TABLE IF EXISTS irvs.irvs_names;
		CREATE TABLE irvs.irvs_names(
			column_id TEXT,
			name TEXT
		)
	'''
	cursor.execute(sql)

def createValuesTable(cursor):
	sql = '''
		DROP TABLE IF EXISTS irvs.irvs_values;
		CREATE TABLE irvs.irvs_values(
			column_id TEXT,
			value TEXT
		)
	'''
	cursor.execute(sql)

def loadTables(cursor):
	nameStmt = '''
		INSERT INTO irvs.irvs_names(column_id, name)
		VALUES ($1, $2);
	'''
	cursor.execute("PREPARE nameStmt AS {}".format(nameStmt))
	nameSql = '''
		EXECUTE nameStmt(%s, %s);
	'''
	valueStmt = '''
		INSERT INTO irvs.irvs_values(column_id, value)
		VALUES ($1, $2);
	'''
	cursor.execute("PREPARE valueStmt AS {}".format(valueStmt))
	valueSql = '''
		EXECUTE valueStmt(%s, %s)
	'''

	firstLineRead = False
	columns = []
	with open(CSV_FILE, 'rb') as data:
		reader = csv.reader(data)
		for row in reader:
			if firstLineRead:
				column = "irvs_" + re.sub("[.-]", "_", row[0].strip())
				columns.append(column)
				nameData = [column, row[1]]
				valueData = [c for c in row[2:] if c]
				cursor.execute(nameSql, nameData)
				for value in valueData:
					cursor.execute(valueSql, [column, value])
			else:
				firstLineRead = True
			# end if
		# end for
	# end with

	createBuildingDataTable(cursor, columns)

	cursor.execute("DEALLOCATE nameStmt")
	cursor.execute("DEALLOCATE valueStmt")
# END loadTables

def main():
	connection = psycopg2.connect(host)
	cursor = connection.cursor()

	createNameTable(cursor)
	createValuesTable(cursor)
	loadTables(cursor)

	connection.commit()

	cursor.close()
	connection.close()
# END main

if __name__ == "__main__":
	main()
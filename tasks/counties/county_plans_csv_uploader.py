import argparse, csv, os, psycopg2, re

from config import host

def updateTable(cursor, fips, expiration, status):
	sql = '''
		UPDATE county_plan_status
		SET plan_status = %s,
			plan_expiration = %s
		WHERE fips = %s
	'''
	cursor.execute(sql, [status, expiration, fips])
# end updateTable

def getExpiration(string):
	if string == '': return None
	if string == 'No Current Plan': return None
	return string
def getStatus(string):
	if string == '': return 0
	return string

def readCsv(url):
	rows = []
	with open(url, 'rb') as data:
		reader = csv.reader(data, delimiter=',')
		reader.next()
		for row in reader:
			fips = row[0]
			expiration = getExpiration(row[3])
			status = getStatus(row[13])
			rows.append((fips, expiration, status))
		# end for
	# end with
	return rows
# end readCsv

parser = argparse.ArgumentParser(description='Capabilities CSV table loader.')

parser.add_argument('url',
				metavar='<Input URL>',
				help='URL for CSV input file.')

def main():
	args = vars(parser.parse_args())

	connection = psycopg2.connect(host)
	cursor = connection.cursor()

	for args in readCsv(args["url"]):
		updateTable(cursor, *args)

	cursor.close()
	connection.commit()
	connection.close()
# end main

if __name__ == "__main__":
	main()
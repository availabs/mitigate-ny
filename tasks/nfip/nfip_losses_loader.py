import argparse, csv, os, psycopg2, re, requests
from urllib import quote

from config import host

COUNTY_REGEX = '^(.+?)\scounty(.+)$'
REGEX = '^(.*?)[,](.*?)\sof(.*)$'
VALUES_REGEX = '^(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(.+)$'

def readLossesFile():
	rows = []
	county = None
	with open('nfip_losses.txt') as data:
		for line in data:
			line = line.strip().lower()
			row = []

			match = re.search(COUNTY_REGEX, line)
			if match:
				county = match.group(1)
				line = match.group(2).strip()

			match = re.search(REGEX, line)
			if match:
				row = [county, \
								match.group(1).strip() + " " + match.group(2).strip()]
				line = match.group(3).strip()

			match = re.search(VALUES_REGEX, re.sub('[,]', '', line))
			if match:
				values = [int(match.group(1)), \
									int(match.group(2)), \
									int(match.group(3)), \
									int(match.group(4)), \
									float(match.group(5))
									]
				row.extend(values)

			if len(row) == 7:
				rows.append(row)

				if row[1] == 'new york city':
					row[0] = 'new york'
					row[1] = 'manhattan borough'

	return rows
# END readLossesFile
def createLossesTable(cursor):
	sql = '''
		DROP TABLE IF EXISTS public.nfip_non_recurring;
		CREATE TABLE public.nfip_non_recurring (
			total_losses INT,
			closed_losses INT,
			open_losses INT,
			cwop_losses INT,
			total_payments NUMERIC,
			county TEXT,
			namelsad TEXT,
			geoid VARCHAR(5),
			cousub_geoid VARCHAR(10)
		)
	'''
	cursor.execute(sql)
# END createLossesTable
def loadLossesTable(cursor, rows):
	sql = """
		INSERT INTO public.nfip_non_recurring(
									county,
									namelsad,
									total_losses,
									closed_losses,
									open_losses,
									cwop_losses,
									total_payments)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	"""
	cursor.execute("PREPARE stmt AS {}".format(sql))

	sql = """
		EXECUTE stmt(%s,%s,%s,%s,%s,%s,%s)
	"""

	for row in rows:
		cursor.execute(sql, row)

	cursor.execute("DEALLOCATE stmt")
# END loadLossTable
def geocodeLossesTable(cursor):
	sql = '''
		UPDATE public.nfip_non_recurring AS nfip
		SET geoid = (
			SELECT geoid
			FROM geo.tl_2017_us_county AS tl
			WHERE tl.statefp = '36'
			AND lower(tl.name) = county
		)
	'''
	cursor.execute(sql)
	sql = '''
		UPDATE public.nfip_non_recurring AS nfip
		SET cousub_geoid = (
			SELECT geoid
			FROM geo.tl_2017_cousub AS tl
			WHERE tl.statefp = '36'
			AND lower(tl.namelsad) = nfip.namelsad
			AND tl.statefp || tl.countyfp = nfip.geoid
		)
	'''
	cursor.execute(sql)
	cursor.execute(sql)
# END geocodeLossesTable

def main():
	connection = psycopg2.connect(host)
	cursor = connection.cursor()

	rows = readLossesFile()
	createLossesTable(cursor)
	loadLossesTable(cursor, rows)
	geocodeLossesTable(cursor)

	connection.commit()

	cursor.close()
	connection.close()
# END main

if __name__ == "__main__":
	main()
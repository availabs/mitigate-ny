import argparse, csv, io, os, psycopg2

from config import host

HOME_DIR = os.environ['HOME']

BUSINESS_FILE = HOME_DIR + '/Downloads/SBA_Disaster_Loan_Data_Superstorm Sandy_business.csv'

HOME_FILE = HOME_DIR + '/Downloads/SBA_Disaster_Loan_Data_Superstorm Sandy_home.csv'

def main():
	num = 0

	sba_data = set()

	firstLineRead = False
	with open(BUSINESS_FILE, 'rb') as data:
		reader = csv.reader(data, delimiter=',', dialect='excel')
		for row in reader:
			if firstLineRead:
				num += 1
				key = "{}_{}_{}".format(row[0], row[2], row[3])
				sba_data.add(key)
			else:
				for i, v in enumerate(row):
					print "{}: {}".format(i, v);
				firstLineRead = True
			# end if
		# end for
	# end with

	firstLineRead = False
	with open(HOME_FILE, 'rb') as data:
		reader = csv.reader(data, delimiter=',', dialect='excel')
		for row in reader:
			if firstLineRead:
				num += 1
			else:
				firstLineRead = True
			# end if
		# end for
	# end with

	declaration_numbers = set()

	print "\nTotal Rows: {}".format(num);
	for key in sba_data:
		keys = key.split("_")
		declaration_numbers.add(keys[0])

	print "\nSBA Physical Declaration Numbers:"
	for num in declaration_numbers:
		print "\t{}".format(num)

if __name__ == "__main__":
	main()
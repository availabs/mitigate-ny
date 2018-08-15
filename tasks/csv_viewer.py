import argparse, csv

def viewCSV(input, num, **rest):
	firstLineRead = False
	rows = 0
	with open(input, 'rb') as businessData:
		reader = csv.reader(businessData, delimiter=',', dialect='excel')
		for row in reader:
			if rows < num:
				if firstLineRead:
					for i, v in enumerate(row):
						print "{}: {}".format(i, v)
					print "\n"
					rows += 1
				else:
					print "printing headers...\n"
					for i, v in enumerate(row):
						print "{}: {}".format(i, v)
					print "\nprinting {} rows...\n".format(num)
					firstLineRead = True
			else:
				break
			# end if
		# end for
	# end with

parser = argparse.ArgumentParser(description='Simple CSV viewer.')

parser.add_argument('input',
				default=None,
				help='URL to input file to view.')

DEFAULT_NUM = 5
parser.add_argument('-n', '--num-rows',
				default=DEFAULT_NUM,
				dest='num',
				help='Number of rows of CSV to view. Defaults to {}.'.format(DEFAULT_NUM))

def main():
	viewCSV(**vars(parser.parse_args()))

if __name__ == "__main__":
	main()
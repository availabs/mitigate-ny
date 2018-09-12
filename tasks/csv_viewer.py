import argparse, csv

Infinity = float("inf")

def viewCSV(input, num, columns, **rest):
	firstLineRead = False
	rows = 0
	rowsToPrint = 0

	if num == "all":
		rowsToPrint = Infinity
	else:
		rowsToPrint = int(num)

	with open(input, 'rb') as businessData:
		reader = csv.reader(businessData, delimiter=',', dialect='excel')
		for row in reader:
			if not firstLineRead:
				print "printing headers...\n"
				for i, v in enumerate(row):
					if (len(columns) == 0) or (i in columns):
						print "{}: {}".format(i, v)
				print "\nprinting {} rows...\n".format(num)
				firstLineRead = True
			elif rows < rowsToPrint:
				for i, v in enumerate(row):
					if (len(columns) == 0) or (i in columns):
						print "{}: {}".format(i, v)
				print "\n"
				rows += 1
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
				help='Number of rows of CSV to view. Use "all" to view all rows. Defaults to {}.'.format(DEFAULT_NUM))

parser.add_argument('-c', '--columns',
				default='-1',
				dest='columns',
				help='View selected columns.')

def coerceArgs(args):
	result = {
		'input': args['input'],
		'num': args['num']
	}

	columns = args['columns'].split(",")

	result['columns'] = [int(c) for c in columns if int(c) > -1]

	return result

def main():
	args = vars(parser.parse_args())
	args = coerceArgs(args)
	viewCSV(**args)

if __name__ == "__main__":
	main()
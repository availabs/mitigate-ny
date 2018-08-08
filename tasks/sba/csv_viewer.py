import argparse, csv

def viewCSV(input, num, **rest):
	firstLineRead = False
	rows = 0
	with open(input, 'rb') as businessData:
		reader = csv.reader(businessData, delimiter=',', dialect='excel')
		for row in reader:
			if rows < num:
				if firstLineRead:
					print row
					rows += 1
				else:
					print row
					firstLineRead = True
			else:
				break
			# end if
		# end for
	# end with

parser = argparse.ArgumentParser(description='SBA Data Tools.')

parser.add_argument('input',
				default=None,
				help='URL to input file to view.')

parser.add_argument('-n', '--num-rows',
				default=10,
				dest='num',
				help='Number of rows of CSV to view.')

def main():
	viewCSV(**vars(parser.parse_args()))

if __name__ == "__main__":
	main()
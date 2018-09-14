import argparse, csv, os, psycopg2

from config import host

CSV_FILE = 'nfip.csv'

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

def toFloat(string):
	try:
		string = string.strip()
		if len(string) is 0:
			return None
		return float(string)
	except:
		print "toFloat ERROR:", string
		return None
# END toFloat

'''
0: State Name
1: Community Name
2: Comm Nbr

3: Prop Locatr

4: Mitigated?
5: Insured?
6: Address Line 1
7: Address Line 2
8: City
9: State
10: Zip Code
11: Prior Address Line 1
12: Prior Address Line 2
13: Prior City
14: Prior State
15: Prior Zip Code
16: Prior Comm Nbr
17: Insureds Name
18: Last Claimant
19: NOTSPECSW
20: NOBLDGSW
21: FLOODPRSW
22: GT100SW
23: UNABLIDSW
24: BOX_1_SW
25: BOX_2_SW
26: BOX_3_SW
27: BOX_4_SW
28: HISTBLDGSW

29: Dt of Loss
30: Occupancy
31: Zone
32: Firm
33: Building Payment
34: Contents Payment

35: Building Value

36: Dt of Loss
37: Occupancy
38: Zone
39: Firm
40: Building Payment
41: Contents Payment

42: Dt of Loss
43: Occupancy
44: Zone
45: Firm
46: Building Payment
47: Contents Payment

48: Dt of Loss
49: Occupancy
50: Zone
51: Firm
52: Building Payment
53: Contents Payment

54: Dt of Loss
55: Occupancy
56: Zone
57: Firm
58: Building Payment
59: Contents Payment

60: Dt of Loss
61: Occupancy
62: Zone
63: Firm
64: Building Payment
65: Contents Payment

66: Dt of Loss
67: Occupancy
68: Zone
69: Firm
70: Building Payment
71: Contents Payment

72: Dt of Loss
73: Occupancy
74: Zone
75: Firm
76: Building Payment
77: Contents Payment

78: Dt of Loss
79: Occupancy
80: Zone
81: Firm
82: Building Payment
83: Contents Payment

84: Tot Building Payment
85: Tot Contents Payment
86: Losses
87: Total Paid
88: Average Pay
89: Data Type
90: As of Date
91: Local Property Identifier
92: County Name
93: County Nbr
94: SRL Indicator
'''

META = [
	{ "column": "prop_locatr",		"type": "VARCHAR",	"convert": toString },
	{ "column": "date_of_loss",		"type": "DATE",		"convert": toString },
	{ "column": "occupancy",		"type": "VARCHAR",	"convert": toString },
	{ "column": "zone",				"type": "VARCHAR",	"convert": toString },
	{ "column": "firm",				"type": "VARCHAR",	"convert": toString },
	{ "column": "building_payment",	"type": "NUMERIC",	"convert": toFloat },
	{ "column": "contents_payment",	"type": "NUMERIC",	"convert": toFloat }
]

def sliceEvents(row):
	events = [
		row[3:4] + [r.strip() for r in row[29:35]],
		row[3:4] + [r.strip() for r in row[36:42]],
		row[3:4] + [r.strip() for r in row[42:48]],
		row[3:4] + [r.strip() for r in row[48:54]],
		row[3:4] + [r.strip() for r in row[54:60]],
		row[3:4] + [r.strip() for r in row[60:66]],
		row[3:4] + [r.strip() for r in row[66:72]],
		row[3:4] + [r.strip() for r in row[72:78]],
		row[3:4] + [r.strip() for r in row[78:84]]
	]
	return [e for e in events if len(e[1]) > 0]

def convert(meta, v):
	return meta["convert"](v)
# END convert

def createTable(cursor):
	print "\nCREATING TABLE..."
	sql = """
		DROP TABLE IF EXISTS public.nfip_losses;
		CREATE TABLE public.nfip_losses (
			{}
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
		INSERT INTO public.nfip_losses({})
		VALUES ({})
	""".format(columns, variables)
	cursor.execute("PREPARE stmt AS {}".format(sql))
# END prepareStatement

def deallocateStatement(cursor):
	cursor.execute("DEALLOCATE stmt")
# END deallocateStatement

def loadCsvData(cursor, inputUrl, **rest):
	prepareStatement(cursor)

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
					events = sliceEvents(row)
					for event in events:
						row = map(convert, META, event)
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
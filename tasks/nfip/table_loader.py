import argparse, csv, os, psycopg2, re

from config import host

CSV_FILE = 'nfip.csv'
'''
State Name
Community Name
Comm Nbr
Prop Locatr
Mitigated?
Insured?
Address Line 1
Address Line 2
City
State
Zip Code
Prior Address Line 1
Prior Address Line 2
Prior City
Prior State
Prior Zip Code
Prior Comm Nbr
Insureds Name
Last Claimant
NOTSPECSW
NOBLDGSW
FLOODPRSW
GT100SW
UNABLIDSW
BOX_1_SW
BOX_2_SW
BOX_3_SW
BOX_4_SW
---HISTBLDGSW
Dt of Loss
Occupancy
Zone
Firm
Building Payment
Contents Payment
---Building Value
Dt of Loss
Occupancy
Zone
Firm
Building Payment
Contents Payment
Dt of Loss
Occupancy
Zone
Firm
Building Payment
Contents Payment
Dt of Loss
Occupancy
Zone
Firm
Building Payment
Contents Payment
Dt of Loss
Occupancy
Zone
Firm
Building Payment
Contents Payment
Dt of Loss
Occupancy
Zone
Firm
Building Payment
Contents Payment
Dt of Loss
Occupancy
Zone
Firm
Building Payment
Contents Payment
Dt of Loss
Occupancy
Zone
Firm
Building Payment
Contents Payment
Dt of Loss
Occupancy
Zone
Firm
Building Payment
Contents Payment
---Tot Building Payment
Tot Contents Payment
Losses
Total Paid
Average Pay
Data Type
As of Date
Local Property Identifier
County Name
County Nbr
SRL Indicator
'''


META = [
	{ "column": None, "type": "VARCHAR" }, #State Name
	{ "column": None, "type": "VARCHAR" }, #Community Name
	{ "column": None, "type": "VARCHAR" }, #Comm Nbr
	{ "column": None, "type": "VARCHAR" }, #Prop Locatr
	{ "column": None, "type": "VARCHAR" }, #Mitigated?
	{ "column": None, "type": "VARCHAR" }, #Insured?
	{ "column": None, "type": "VARCHAR" }, #Address Line 1
	{ "column": None, "type": "VARCHAR" }, #Address Line 2
	{ "column": None, "type": "VARCHAR" }, #City
	{ "column": None, "type": "VARCHAR" }, #State
	{ "column": None, "type": "VARCHAR" }, #Zip Code
	{ "column": None, "type": "VARCHAR" }, #Prior Address Line 1
	{ "column": None, "type": "VARCHAR" }, #Prior Address Line 2
	{ "column": None, "type": "VARCHAR" }, #Prior City
	{ "column": None, "type": "VARCHAR" }, #Prior State
	{ "column": None, "type": "VARCHAR" }, #Prior Zip Code
	{ "column": None, "type": "VARCHAR" }, #Prior Comm Nbr
	{ "column": None, "type": "VARCHAR" }, #Insureds Name
	{ "column": None, "type": "VARCHAR" }, #Last Claimant
	{ "column": None, "type": "VARCHAR" }, #NOTSPECSW
	{ "column": None, "type": "VARCHAR" }, #NOBLDGSW
	{ "column": None, "type": "VARCHAR" }, #FLOODPRSW
	{ "column": None, "type": "VARCHAR" }, #GT100SW
	{ "column": None, "type": "VARCHAR" }, #UNABLIDSW
	{ "column": None, "type": "VARCHAR" }, #BOX_1_SW
	{ "column": None, "type": "VARCHAR" }, #BOX_2_SW
	{ "column": None, "type": "VARCHAR" }, #BOX_3_SW
	{ "column": None, "type": "VARCHAR" }, #BOX_4_SW
	{ "column": None, "type": "VARCHAR" }, #HISTBLDGSW
	# { "column": None, "type": "VARCHAR" }, #Dt of Loss
	# { "column": None, "type": "VARCHAR" }, #Occupancy
	# { "column": None, "type": "VARCHAR" }, #Zone
	# { "column": None, "type": "VARCHAR" }, #Firm
	# { "column": None, "type": "VARCHAR" }, #Building Payment
	# { "column": None, "type": "VARCHAR" }, #Contents Payment
	{ "column": None, "type": "NUMERIC(2)" }, #Building Value
	# { "column": None, "type": "VARCHAR" }, #Dt of Loss
	# { "column": None, "type": "VARCHAR" }, #Occupancy
	# { "column": None, "type": "VARCHAR" }, #Zone
	# { "column": None, "type": "VARCHAR" }, #Firm
	# { "column": None, "type": "VARCHAR" }, #Building Payment
	# { "column": None, "type": "VARCHAR" }, #Contents Payment
	# { "column": None, "type": "VARCHAR" }, #Dt of Loss
	# { "column": None, "type": "VARCHAR" }, #Occupancy
	# { "column": None, "type": "VARCHAR" }, #Zone
	# { "column": None, "type": "VARCHAR" }, #Firm
	# { "column": None, "type": "VARCHAR" }, #Building Payment
	# { "column": None, "type": "VARCHAR" }, #Contents Payment
	# { "column": None, "type": "VARCHAR" }, #Dt of Loss
	# { "column": None, "type": "VARCHAR" }, #Occupancy
	# { "column": None, "type": "VARCHAR" }, #Zone
	# { "column": None, "type": "VARCHAR" }, #Firm
	# { "column": None, "type": "VARCHAR" }, #Building Payment
	# { "column": None, "type": "VARCHAR" }, #Contents Payment
	# { "column": None, "type": "VARCHAR" }, #Dt of Loss
	# { "column": None, "type": "VARCHAR" }, #Occupancy
	# { "column": None, "type": "VARCHAR" }, #Zone
	# { "column": None, "type": "VARCHAR" }, #Firm
	# { "column": None, "type": "VARCHAR" }, #Building Payment
	# { "column": None, "type": "VARCHAR" }, #Contents Payment
	# { "column": None, "type": "VARCHAR" }, #Dt of Loss
	# { "column": None, "type": "VARCHAR" }, #Occupancy
	# { "column": None, "type": "VARCHAR" }, #Zone
	# { "column": None, "type": "VARCHAR" }, #Firm
	# { "column": None, "type": "VARCHAR" }, #Building Payment
	# { "column": None, "type": "VARCHAR" }, #Contents Payment
	# { "column": None, "type": "VARCHAR" }, #Dt of Loss
	# { "column": None, "type": "VARCHAR" }, #Occupancy
	# { "column": None, "type": "VARCHAR" }, #Zone
	# { "column": None, "type": "VARCHAR" }, #Firm
	# { "column": None, "type": "VARCHAR" }, #Building Payment
	# { "column": None, "type": "VARCHAR" }, #Contents Payment
	# { "column": None, "type": "VARCHAR" }, #Dt of Loss
	# { "column": None, "type": "VARCHAR" }, #Occupancy
	# { "column": None, "type": "VARCHAR" }, #Zone
	# { "column": None, "type": "VARCHAR" }, #Firm
	# { "column": None, "type": "VARCHAR" }, #Building Payment
	# { "column": None, "type": "VARCHAR" }, #Contents Payment
	# { "column": None, "type": "VARCHAR" }, #Dt of Loss
	# { "column": None, "type": "VARCHAR" }, #Occupancy
	# { "column": None, "type": "VARCHAR" }, #Zone
	# { "column": None, "type": "VARCHAR" }, #Firm
	# { "column": None, "type": "VARCHAR" }, #Building Payment
	# { "column": None, "type": "VARCHAR" }, #Contents Payment
	{ "column": None, "type": "NUMERIC(2)" }, #Tot Building Payment
	{ "column": None, "type": "NUMERIC(2)" }, #Tot Contents Payment
	{ "column": None, "type": "INTEGER" }, #Losses
	{ "column": None, "type": "NUMERIC(2)" }, #Total Paid
	{ "column": None, "type": "NUMERIC(2)" }, #Average Pay
	{ "column": None, "type": "VARCHAR" }, #Data Type
	{ "column": None, "type": "DATE" }, #As of Date
	{ "column": None, "type": "VARCHAR" }, #Local Property Identifier
	{ "column": None, "type": "VARCHAR" }, #County Name
	{ "column": None, "type": "VARCHAR" }, #County Nbr
	{ "column": None, "type": "VARCHAR" }, #SRL Indicator
]

def makeColumnName(string):
	return "_".join(string.lower().replace("?", "").split(" "))

def transform(row):
	return row[0 : 30] + row[35 : 36] + row[84 : 95]

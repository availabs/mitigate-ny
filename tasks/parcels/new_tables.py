import argparse, psycopg2

from config import host

def createBuildingToParcelTable(cursor):
	print 'CREATING TABLE "parcel.building_to_parcel"'
	sql = '''
		DROP TABLE IF EXISTS parcel.building_to_parcel;
		CREATE TABLE parcel.building_to_parcel(
			buildingid BIGINT,
			parcelid BIGINT
		);
	'''
	cursor.execute(sql);
# END createBuildingToParcelTable
def loadBuildingToParcel(cursor):
	sql = '''
		INSERT INTO parcel.building_to_parcel(buildingid, parcelid)
			(
				SELECT ogc_fid AS buildingid,
					objectid AS parcelid
				FROM public."nys_2017_tax_parcels_agencies_4326_WGS_84" AS parcels
				JOIN public.buildingfootprint_ms AS bldngs
				ON ST_Contains(parcels.geom, bldngs.wkb_geometry)
			)
	'''
	cursor.execute(sql)
# END loadBuildingToParcel

def createBuildingToOgsTable(cursor):
	print 'CREATING TABLE "parcel.building_to_ogs"'
	sql = '''
		DROP TABLE IF EXISTS parcel.building_to_ogs;
		CREATE TABLE parcel.building_to_ogs(
			buildingid BIGINT,
			ogsid BIGINT
		);
	'''
	cursor.execute(sql);
# END createBuildingToOgsTable
def loadBuildingToOgs(cursor):
	sql = '''
		INSERT INTO parcel.building_to_ogs(buildingid, ogsid)
			(
				SELECT ogc_fid AS buildingid,
					id AS ogsid
				FROM public.buildingfootprint_ms AS bldngs
				JOIN public.ogs AS ogs
				ON ST_Contains(bldngs.wkb_geometry, ST_SetSRID(ST_MakePoint(Coalesce(ogs.building_longitude, ogs.site_longitude), Coalesce(ogs.building_latitude, ogs.site_latitude)), 4326))
			)
	'''
	cursor.execute(sql)
# END loadBuildingToOgs

'''
119518
431508
1411026
1662751
2268185
2356490
4136627
4591817
4837794
'''

parser = argparse.ArgumentParser(description='Building Crosser.')

parser.add_argument('-p', '--parcels',
										default=False,
										action='store_true',
										dest='parcels')

parser.add_argument('-o', '--ogs',
										default=False,
										action='store_true',
										dest='ogs')

def main():
	args = vars(parser.parse_args())

	conn = psycopg2.connect(host)
	cursor = conn.cursor()

	if args["parcels"]:
		createBuildingToParcelTable(cursor)
		loadBuildingToParcel(cursor)
		
	if args["ogs"]:
		createBuildingToOgsTable(cursor)
		loadBuildingToOgs(cursor)

	conn.commit()
	cursor.close()
	conn.close()
# END main

if __name__ == "__main__":
	main()
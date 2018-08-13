GENERATED_FILES = \
	ny.json

all: $(GENERATED_FILES)

.PHONY: clean all

clean:
	rm -rf -- $(GENERATED_FILES) build

# build/tl_2017_us_county.zip:
# 	curl -o $@ 'https://www2.census.gov/geo/tiger/TIGER2017/COUNTY/$(notdir $@)'

# build/tl_2017_%_tract.zip:
# 	curl -o $@ 'https://www2.census.gov/geo/tiger/TIGER2017/TRACT/$(notdir $@)'

# build/tl_2017_%_cousub.zip:
# 	curl -o $@ 'https://www2.census.gov/geo/tiger/TIGER2017/COUSUB/$(notdir $@)'

build/cb_2017_%_tract_500k.zip:
	curl -o $@ 'https://www2.census.gov/geo/tiger/GENZ2017/shp/$(notdir $@)'

build/cb_2017_%_cousub_500k.zip:
	curl -o $@ 'https://www2.census.gov/geo/tiger/GENZ2017/shp/$(notdir $@)'

build/cb_2017_us_zcta510_500k.zip:
	curl -o $@ 'https://www2.census.gov/geo/tiger/GENZ2017/shp/$(notdir $@)'

build/cb_2017_us_county_500k.zip:
	curl -o $@ 'https://www2.census.gov/geo/tiger/GENZ2017/shp/$(notdir $@)' 	

build/counties.shp: build/cb_2017_us_county_500k.zip
	rm -rf $(basename $@)
	mkdir -p $(basename $@)
	unzip -d $(basename $@) $<
	for file in $(basename $@)/*; do chmod 644 $$file; mv $$file $(basename $@).$${file##*.}; done
	rmdir $(basename $@)
	touch $@

build/tracts.shp: build/cb_2017_36_tract_500k.zip
	rm -rf $(basename $@)
	mkdir -p $(basename $@)
	unzip -d $(basename $@) $<
	for file in $(basename $@)/*; do chmod 644 $$file; mv $$file $(basename $@).$${file##*.}; done
	rmdir $(basename $@)
	touch $@

build/cousub.shp: build/cb_2017_36_cousub_500k.zip
	rm -rf $(basename $@)
	mkdir -p $(basename $@)
	unzip -d $(basename $@) $<
	for file in $(basename $@)/*; do chmod 644 $$file; mv $$file $(basename $@).$${file##*.}; done
	rmdir $(basename $@)
	touch $@

build/zipcodes.shp: build/cb_2017_us_zcta510_500k.zip
	rm -rf $(basename $@)
	mkdir -p $(basename $@)
	unzip -d $(basename $@) $<
	for file in $(basename $@)/*; do chmod 644 $$file; mv $$file $(basename $@).$${file##*.}; done
	rmdir $(basename $@)
	touch $@
	
ny_counties.ndjson: build/counties.shp
	shp2json $< \
	| ndjson-split 'd.features' \
	| ndjson-filter 'd.properties.STATEFP === "36"' \
	| ndjson-map 'd.properties = {geoid: d.properties.GEOID, name: d.properties.NAMELSAD}, d' \
	> ny_counties.ndjson

ny_zipcodes.ndjson: build/zipcodes.shp
	shp2json $< \
	| ndjson-split 'd.features' \
	| ndjson-filter '+d.properties.GEOID10 >= 10001 && +d.properties.GEOID10 <= 14975' \
	| ndjson-map 'd.properties = {geoid: d.properties.GEOID10}, d' \
	> ny_zipcodes.ndjson

ny_cousub.ndjson: build/cousub.shp
	shp2json $< \
	| ndjson-split 'd.features' \
	| ndjson-map 'd.properties = {geoid: d.properties.GEOID, name: d.properties.NAMELSAD}, d' \
	> ny_cousub.ndjson

ny_tracts.ndjson: build/tracts.shp
	shp2json $< \
	| ndjson-split 'd.features' \
	| ndjson-filter 'd.properties.ALAND > 100' \
	| ndjson-map 'd.properties = {geoid: d.properties.GEOID}, d' \
	> ny_tracts.ndjson

# ny.json: ny_tracts.ndjson ny_cousub.ndjson ny_counties.ndjson
# 	geo2topo -n tracts=ny_tracts.ndjson counties=ny_counties.ndjson cousub=ny_cousub.ndjson | toposimplify -s 0.001 -f | topoquantize 1e7 > ny.json
# 	rm *.ndjson

ny.json: ny_tracts.ndjson ny_cousub.ndjson ny_counties.ndjson ny_zipcodes.ndjson
	geo2topo -n tracts=ny_tracts.ndjson counties=ny_counties.ndjson cousubs=ny_cousub.ndjson zips=ny_zipcodes.ndjson > ny.json
	rm *.ndjson



FIPS = \
	01 02 04 05 06 08 09 10 11 12 13 \
	15 16 17 18 19 20 21 22 23 24 25 26 \
	27 28 29 30 31 32 33 34 35 36 37 38 \
	39 40 41 42 44 45 46 47 48 49 50 51 \
	53 54 55 56 60 66 72 78 


GENERATED_FILES = \
	tiger2017.mbtiles

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

build/cb_2017_%_bg_500k.zip:
	curl -o $@ 'https://www2.census.gov/geo/tiger/GENZ2017/shp/$(notdir $@)'

build/cb_2017_%_tract_500k.zip:
	curl -o $@ 'https://www2.census.gov/geo/tiger/GENZ2017/shp/$(notdir $@)'

build/cb_2017_%_cousub_500k.zip:
	curl -o $@ 'https://www2.census.gov/geo/tiger/GENZ2017/shp/$(notdir $@)'

build/cb_2017_us_zcta510_500k.zip:
	curl -o $@ 'https://www2.census.gov/geo/tiger/GENZ2017/shp/$(notdir $@)'

build/cb_2017_us_county_500k.zip:
	curl -o $@ 'https://www2.census.gov/geo/tiger/GENZ2017/shp/$(notdir $@)'

build/cb_2017_us_state_500k.zip:
	curl -o $@ 'https://www2.census.gov/geo/tiger/GENZ2017/shp/$(notdir $@)' 

## Unzip files

build/bg_%.shp: build/cb_2017_%_bg_500k.zip
	rm -rf $(basename $@)
	mkdir -p $(basename $@)
	unzip -d $(basename $@) $<
	for file in $(basename $@)/*; do chmod 644 $$file; mv $$file $(basename $@).$${file##*.}; done
	rmdir $(basename $@)
	touch $@
	
build/tracts_%.shp: build/cb_2017_%_tract_500k.zip
	rm -rf $(basename $@)
	mkdir -p $(basename $@)
	unzip -d $(basename $@) $<
	for file in $(basename $@)/*; do chmod 644 $$file; mv $$file $(basename $@).$${file##*.}; done
	rmdir $(basename $@)
	touch $@
	
build/cousub_%.shp: build/cb_2017_%_cousub_500k.zip
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
	
build/counties.shp: build/cb_2017_us_county_500k.zip
	rm -rf $(basename $@)
	mkdir -p $(basename $@)
	unzip -d $(basename $@) $<
	for file in $(basename $@)/*; do chmod 644 $$file; mv $$file $(basename $@).$${file##*.}; done
	rmdir $(basename $@)
	touch $@

build/states.shp: build/cb_2017_us_state_500k.zip
	rm -rf $(basename $@)
	mkdir -p $(basename $@)
	unzip -d $(basename $@) $<
	for file in $(basename $@)/*; do chmod 644 $$file; mv $$file $(basename $@).$${file##*.}; done
	rmdir $(basename $@)
	touch $@
	
	

#build state ndjson files

build/bg_%.ndjson: build/bg_%.shp
	shp2json $< | ndjson-split 'd.features' \
	| ndjson-map 'd.properties = {geoid: d.properties.GEOID}, d' \
	> $@

build/tracts_%.ndjson: build/tracts_%.shp
	shp2json $< | ndjson-split 'd.features' \
	| ndjson-map 'd.properties = {geoid: d.properties.GEOID}, d' \
	> $@

build/cousub_%.ndjson: build/cousub_%.shp
	shp2json $< | ndjson-split 'd.features' \
	| ndjson-map 'd.properties = {geoid: d.properties.GEOID}, d' \
	> $@

zipcodes.ndjson: build/zipcodes.shp
	shp2json $< \
	| ndjson-split 'd.features' \
	| ndjson-map 'd.properties = {geoid: d.properties.GEOID10}, d' \
	> $@

counties.ndjson: build/counties.shp
	shp2json $< \
	| ndjson-split 'd.features' \
	| ndjson-map 'd.properties = {geoid: d.properties.GEOID, name: d.properties.NAMELSAD}, d' \
	> $@

states.ndjson: build/states.shp
	shp2json $< \
	| ndjson-split 'd.features' \
	| ndjson-map 'd.properties = {geoid: d.properties.GEOID, name: d.properties.NAMELSAD}, d' \
	> $@


#build us ndjson

bg.ndjson: $(addprefix build/bg_,$(addsuffix .ndjson,$(FIPS)))
	cat $(addprefix build/bg_,$(addsuffix .ndjson,$(FIPS))) > $@

tracts.ndjson: $(addprefix build/tracts_,$(addsuffix .ndjson,$(FIPS)))
	cat $(addprefix build/tracts_,$(addsuffix .ndjson,$(FIPS))) > $@

cousub.ndjson: $(addprefix build/cousub_,$(addsuffix .ndjson,$(FIPS)))
	cat $(addprefix build/cousub_,$(addsuffix .ndjson,$(FIPS))) > $@

tiger2017.mbtiles: states.ndjson counties.ndjson zipcodes.ndjson cousub.ndjson tracts.ndjson bg.ndjson
	tippecanoe -o $@ -zg --coalesce-densest-as-needed states.ndjson counties.ndjson zipcodes.ndjson cousub.ndjson tracts.ndjson bg.ndjson

us_tracts.mbtiles: tracts.ndjson
	tippecanoe -o us_tracts.mbtiles -zg --coalesce-densest-as-needed us_tracts.ndjson


GENERATED_FILES = \
	pr.json

all: $(GENERATED_FILES)

.PHONY: clean all

clean:
	rm -rf -- $(GENERATED_FILES) build *.ndjson

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

build/tracts.shp: build/cb_2017_72_tract_500k.zip
	rm -rf $(basename $@)
	mkdir -p $(basename $@)
	unzip -d $(basename $@) $<
	for file in $(basename $@)/*; do chmod 644 $$file; mv $$file $(basename $@).$${file##*.}; done
	rmdir $(basename $@)
	touch $@

build/cousub.shp: build/cb_2017_72_cousub_500k.zip
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
	
pr_counties.ndjson: build/counties.shp
	shp2json $< \
	| ndjson-split 'd.features' \
	| ndjson-filter 'd.properties.STATEFP === "72"' \
	| ndjson-map 'd.properties = {geoid: d.properties.GEOID, name: d.properties.NAMELSAD}, d' \
	> pr_counties.ndjson

pr_zipcodes.ndjson: build/zipcodes.shp
	shp2json $< \
	| ndjson-split 'd.features' \
	| ndjson-filter '(+d.properties.GEOID10 >= 00600 && +d.properties.GEOID10 <= 00799) || (+d.properties.GEOID10 >= 00900 && +d.properties.GEOID10 <= 00999)' \
	| ndjson-map 'd.properties = {geoid: d.properties.GEOID10}, d' \
	> pr_zipcodes.ndjson

pr_cousub.ndjson: build/cousub.shp
	shp2json $< \
	| ndjson-split 'd.features' \
	| ndjson-map 'd.properties = {geoid: d.properties.GEOID, name: d.properties.NAMELSAD}, d' \
	> pr_cousub.ndjson

pr_tracts.ndjson: build/tracts.shp
	shp2json $< \
	| ndjson-split 'd.features' \
	| ndjson-filter 'd.properties.ALAND > 100' \
	| ndjson-map 'd.properties = {geoid: d.properties.GEOID}, d' \
	> pr_tracts.ndjson

build_dir:
	mkdir build

# pr.json: pr_tracts.ndjson pr_cousub.ndjson pr_counties.ndjson
# 	geo2topo -n tracts=pr_tracts.ndjson counties=pr_counties.ndjson cousub=pr_cousub.ndjson | toposimplify -s 0.001 -f | topoquantize 1e7 > pr.json
# 	rm *.ndjson

pr.json: build_dir pr_tracts.ndjson pr_cousub.ndjson pr_counties.ndjson pr_zipcodes.ndjson
	geo2topo -n tracts=pr_tracts.ndjson counties=pr_counties.ndjson cousubs=pr_cousub.ndjson zips=pr_zipcodes.ndjson > pr.json
	rm *.ndjson
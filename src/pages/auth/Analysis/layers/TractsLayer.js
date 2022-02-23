import React from "react"


// import MapLayer from "components/AvlMap/MapLayer"
// import React from "react"
// import styled from 'styled-components';

import * as d3scale from "d3-scale"

import MapLayer from "components/AvlMap/MapLayer"

import { falcorGraph } from "store/falcorGraph"

import mapboxgl from 'mapbox-gl/dist/mapbox-gl'

import COLOR_RANGES from "constants/color-ranges"



const getColor = ( name ) => COLOR_RANGES[5].reduce((a, c) => c.name === name ? c.colors : a).slice()

const hazardMeta = [
  {value:'wind', name:'Wind', description: '', sheldus: "Wind", colors: getColor('Greys')},
  {value:'wildfire', name:'Wildfire', description: '', sheldus: "Wildfire", colors: getColor('Blues')},
  {value:'tsunami', name:'Tsunami/Seiche', description: '', sheldus: "Tsunami/Seiche", colors: getColor('Blues')},
  {value:'tornado', name:'Tornado', description: '', sheldus: "Tornado", colors: getColor('Blues')},
  {value:'riverine', name:'Flooding', description: '', sheldus: "Flooding", colors: getColor('PuBuGn')},
  {value:'lightning', name:'Lightning', description: '', sheldus: "Lightning", colors: getColor('Blues')},
  {value:'landslide', name:'Landslide', description: '', sheldus: "Landslide", colors: getColor('Blues')},
  {value:'icestorm', name:'Ice Storm', description: '', sheldus: "", colors: getColor('Blues')},
  {value:'hurricane', name:'Hurricane', description: '', sheldus: "Hurricane/Tropical Storm", colors: getColor('Purples')},
  {value:'heatwave', name:'Heat Wave', description: '', sheldus: "Heat", colors: getColor('Blues')},
  {value:'hail', name:'Hail', description: '', sheldus:"Hail", colors: getColor('Blues')},
  {value:'earthquake', name:'Earthquake', description: '', sheldus: "Earthquake", colors: getColor('Blues')},
  {value:'drought', name:'Drought', description: '', sheldus: "Drought", colors: getColor('Blues')},
  {value:'avalanche', name:'Avalanche', description: '', sheldus: "Avalanche", colors: getColor('Blues')},
  {value:'coldwave', name:'Coldwave', description: '', colors: getColor('Blues')},
  {value:'winterweat', name:'Snow Storm', description: '', sheldus: "Winter Weather", colors: getColor('Blues')},
  {value:'volcano', name:'Volcano', description: '', colors: getColor('Blues')},
  {value:'coastal', name:'Coastal Hazards', description:'',sheldus: "Coastal Hazards", colors: getColor('Blues')}
]


class TractLayer extends MapLayer {

  onAdd(map) {
    super.onAdd(map);
    console.log('adding data')
    return falcorGraph.get(['geo','36', 'tracts'])
      .then(data => {
        
        let tracts = data.json.geo[36].tracts;
        console.log('geodata', data, tracts)
        this.tracts = tracts;
        map.setFilter('tracts-layer', ['all', ['in', 'geoid', ...tracts]]);
        this.fetchData().then(data => this.receiveData(map, data))
      })

  }

  fetchData() {
    if (this.tracts && this.tracts.length < 2) return Promise.resolve({ route: [] });
    return falcorGraph.get(['severeWeather', this.tracts, this.filters.hazard.value, 'tract_totals', 'total_damage'])
      .then(fullData => {
        // console.log('get full data', fullData.json.severeWeather)
        return fullData.json.severeWeather
      })
  }
  receiveData(map, data) {
    
    let keyDomain = Object.keys(data).filter(d => d != '$__path').reduce((out,curr) => {
      out[curr] = data[curr][this.filters.hazard.value].tract_totals.total_damage
      return out;
    },{})
    console.log('keyDomain',keyDomain);
    let range = hazardMeta.filter(d => d.value === this.filters.hazard.value)[0].colors;
    console.log('range', range);
    let colorScale = d3scale.scaleThreshold()
        .domain([50000,1000000,2000000,4000000,600000])
        .range(range);

    let mapColors = Object.keys(keyDomain).reduce((out,curr) => {
      out[curr] = colorScale(keyDomain[curr])
      return out;
    },{});
    console.log('mapColors',mapColors)
    map.setPaintProperty(
      'tracts-layer', 
      'fill-color', 
      ["get", ["to-string", ["get", "geoid"]], ["literal", mapColors]]
    );

     map.setPaintProperty(
      'tracts-layer',
      'fill-opacity', 
       0.7
    );
    // map.setPaintProperty(
    //   'tracts-layer', 
    //   'line-color', 
    //   '#000'
    // );

  }
}



const tractLayer = new TractLayer("Tracts Layer", {
  active: true,
  sources: [
    { id: "tracts",
      source: {
        'type': "vector",
        'url': 'mapbox://am3081.92hcxki8'
      }
    }
  ],
  layers: [
    { 'id': 'tracts-layer',
      'source': 'tracts',
      'source-layer': 'tracts',
      'type': 'fill',
      'paint': {
          'fill-color': 'rgba(196, 0, 0, 0.1)',
      }
    }
  ],
  filters: {
    hazard: {
      name: "hazard",
      type: "hidden",
      domain: hazardMeta,
      value: "hurricane"
    }
  },
  popover: {
    layers: ['tracts-layer'],
    dataFunc: feature =>
      ["tract", ["Test", feature.properties.geoid]]
  }
})

export default tractLayer
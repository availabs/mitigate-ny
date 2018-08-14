import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import * as d3scale from "d3-scale";

import * as turf from "@turf/turf"

import {
	getChildGeo,
	getGeoMesh,
	getGeoMerge
} from 'store/modules/geo'

import HazardEventsMap from "./HazardEventsMap"
import HazardEventsLegend from "./HazardEventsLegend"

import Viewport from "components/mapping/escmap/Viewport"

import {
  EARLIEST_YEAR,
  LATEST_YEAR
} from "./yearsOfSevereWeatherData";

const D3_CATEGORY20 = [
  "#1f77b4",
  "#aec7e8",
  "#ff7f0e",
  "#ffbb78",
  "#2ca02c",
  "#98df8a",
  "#d62728",
  "#ff9896",
  "#9467bd",
  "#c5b0d5",
  "#8c564b",
  "#c49c94",
  "#e377c2",
  "#f7b6d2",
  "#7f7f7f",
  "#c7c7c7",
  "#bcbd22",
  "#dbdb8d",
  "#17becf",
  "#9edae5"
];

const COLOR_SCALE = d3scale.scaleOrdinal()
    .range(D3_CATEGORY20);

const RADIUS_SCALE = d3scale.scaleLog()
		.domain([50000, 10000000]) // Dollar amount
		.range([4, 40]); // radius in kilometers

const getMapDefaults = (width, height=null) =>
	width === 12 ? {
		showLegend: true,
		height: height || 800
	}
	: width === 6 ? {
		showLegend: false,
        dragRotate: false,
        scrollZoom: false,
        dragPan: false,
        height: height || 550,
        zoomPadding: 5,
        padding: "1em"
	}
	: {
		showLegend: false,
        dragRotate: false,
        scrollZoom: false,
        dragPan: false,
        height: height || 375,
        zoomPadding: 5,
        padding: "1em"
	}

const getMapWidth = numMaps =>
	numMaps === 1 ? 12
	: (numMaps % 3) === 0 ? 4
	: (numMaps === 2) || (numMaps === 4) ? 6
	: 4

class HazardEventsMapController extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			viewport: Viewport(),
			eventsData: {},
			loadedRanges: {},
			bounds: null
		}
	}

  	componentWillMount() {
	    this.props.getChildGeo('36', 'counties');
	    this.props.getGeoMesh('36', 'counties');
	    this.props.getGeoMerge('36', 'counties');
	    this.props.getChildGeo('36', 'cousubs');
  	}

  	updateLoadedRanges({ from, to }) {
  		const key = `loaded-${ from }-${ to }`;
  		let { loadedRanges } = this.state;
  		if (!(key in loadedRanges)) {
  			loadedRanges = { ...loadedRanges, [key]: { range: [from, to], processed: false } }
  			this.setState({ loadedRanges });
  		}
  	}
  	componentDidUpdate() {
  		const { loadedRanges } = this.state;
  		for (const key in loadedRanges) {
  			const { processed } = loadedRanges[key];
  			if (!processed) {
  				this.processData(key);
  			}
  		}
  	}

  	componentWillReceiveProps(newProps) {
  		const { geoid, geoLevel } = newProps;
  		let geojson = null
  		let padding = this.props.zoomPadding
  		// let fitGeojson = false;
  		switch (geoLevel) {
			case 'counties':
				geojson = newProps.geo['merge']['36']['counties']
				// fitGeojson = geojson.coordinates.length && !this.props.geo['merge']['36']['counties'].coordinates.length;
				break;
			case 'cousubs':
				geojson = newProps.geo['36']['counties'].features
						.reduce((a, c) => (c.properties.geoid == geoid) ? c : a, null);
				// fitGeojson = newProps.geo['36']['counties'].features.length && !this.props.geo['36']['counties'].features.length;
				break;
  		}
  		// if (fitGeojson) {
  			this.state.viewport.fitGeojson(geojson, { padding });
  		// }
  		this.setState({ bounds: geojson })
  		if (geoid != this.props.geoid) {
  			this.setState({ loadedRanges: {} })
  		}
  	}

  	fetchFalcorDeps() {
	    const { geoid, dataType, geoLevel, hazard } = this.props;

	    return this.props.falcor.get(
	      	['geo', geoid, geoLevel],
	      	['riskIndex', 'hazards']
	    ).then(falcorResponse => {
	      	const geoids = falcorResponse.json.geo[geoid][geoLevel],
	        	hazards = hazard ? [hazard] : falcorResponse.json.riskIndex.hazards,
        		requests = [],

        		yearsPerRequest = 3;
      		COLOR_SCALE.domain(falcorResponse.json.riskIndex.hazards);
      		for (let i = LATEST_YEAR; i >= EARLIEST_YEAR; i -= yearsPerRequest) {
        		requests.push([dataType, 'events', 'borked', geoids, hazards, { from: Math.max(i - yearsPerRequest + 1, EARLIEST_YEAR), to: i }, 'property_damage'])
      		}
	      	return requests.reduce((a, c) =>
	      		a.then(() => this.props.falcor.get(c))
	      			.then(() => this.updateLoadedRanges(c[5]))
	      	, Promise.resolve());
	    })
  	}

  	processData(key) {
  		let {
  			eventsData,
  			loadedRanges
  		} = this.state;

  		const { range } = loadedRanges[key];

  		const { geoid, dataType, geoLevel, hazard } = this.props,

	    	features = this.props.geo['36'][geoLevel].features;

	    if (!(geoid in eventsData)) {
	    	eventsData[geoid] = {}
	    }
	    if (!(geoLevel in eventsData[geoid])) {
	    	eventsData[geoid][geoLevel] = {};
	    }
	    const geoData = eventsData[geoid][geoLevel];

  		try {
  			const hazards = hazard ? [hazard] : this.props.riskIndex.hazards.value

			this.props.geoGraph[geoid][geoLevel].value
				.forEach(geoid => {
					if (!(geoid in geoData)) {
						geoData[geoid] = {};
					}
					hazards.forEach(hazard => {
						if (!(hazard in geoData[geoid])) {
							geoData[geoid][hazard] = {};
						}
						for (let year = range[0]; year <= range[1]; ++year) {
							if (!(year in geoData[geoid][hazard])) {
								geoData[geoid][hazard][year] = [];
							}

							const events = this.props[dataType].events.borked[geoid][hazard][year]["property_damage"].value;

							if (events.length) {

								const feature = features.reduce((a, c) => c.properties.geoid === geoid ? c : a);

								events.forEach(event => {
									const property_damage = +event.property_damage,
										geom = event.geom,

										properties = { property_damage, hazard };

									let circle;

									if ((property_damage < RADIUS_SCALE.domain()[0]) &&
										(geoLevel === "counties")) return;

									if (geom) {
										circle = turf.circle(JSON.parse(geom).coordinates, RADIUS_SCALE(property_damage), { units: "kilometers", properties });
									}
									else {
										const centroid = turf.centroid(feature);
										circle = turf.circle(centroid.geometry.coordinates, RADIUS_SCALE(property_damage), { units: "kilometers", properties });
									}
									if (circle) geoData[geoid][hazard][year].push(circle);
								})

							}
						}
					})
				})
  		}
  		catch (e) {
  			return;
  		}
  		loadedRanges = { ...loadedRanges, [key]: { range, processed: true } }
		this.setState({ eventsData, loadedRanges });
  	}

	render() {
		let {
			showLegend,
			numMaps
		} = this.props;
		showLegend = (showLegend !== "auto") ? showLegend : (numMaps > 1)
		const maps = Array(this.props.numMaps).fill(getMapWidth(this.props.numMaps))
			.map((width, n) =>
				<div className={ `col-lg-${ width }` } key={ n }>
	              	<HazardEventsMap
	              		eventsData={ this.state.eventsData }
	              		yearDelta={ n + 1 - this.props.numMaps }
	              		geoLevel={ this.props.geoLevel }
      					geoid={ this.props.geoid }
      					dataType={ this.props.dataType }
	              		{ ...getMapDefaults(width, this.props.mapHeight) }
	              		mapLegendLocation={ this.props.mapLegendLocation }
	              		mapLegendSize={ this.props.mapLegendSize }
	              		mapControlsLocation={ this.props.mapControlsLocation }
		              	viewport={ this.state.viewport }
		                colorScale={ this.props.colorScale }
		                radiusScale={ RADIUS_SCALE }
		                zoomPadding={ this.props.zoomPadding }
		                hazard={ this.props.hazard }
		                bounds={ this.state.bounds }/>
	            </div>
	        , this);

		return (
			<div className='row'>
				{
					!showLegend ? null :
					<HazardEventsLegend
						viewport={ this.state.viewport }
						colorScale={ this.props.colorScale }
		                radiusScale={ RADIUS_SCALE }/>
				}
				{ maps.reverse() }
			</div>
		)
	}
}
HazardEventsMapController.defaultProps = {
	geoid: '36',
	dataType: 'severeWeather',
	geoLevel: 'counties',
	numMaps: 1,
	showLegend: "auto",
	mapLegendLocation: 'top-right',
	mapLegendSize: "large",
	mapControlsLocation: "top-left",
	colorScale: COLOR_SCALE,
	mapHeight: null,
	zoomPadding: 20,
	hazard: null
}

const mapStateToProps = state => ({
  	router: state.router,
    geo: state.geo,
    geoGraph: state.graph.geo,
    severeWeather: state.graph.severeWeather,
    riskIndex: state.graph.riskIndex
})

const mapDispatchToProps = {
  getChildGeo,
  getGeoMesh,
  getGeoMerge
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardEventsMapController));
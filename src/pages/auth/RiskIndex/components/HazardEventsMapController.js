import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { createMatchSelector } from 'react-router-redux';

import * as d3scale from "d3-scale";

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

const getMapDefaults = width =>
	width == 12 ? {
		showLegend: true
	}
	: width == 6 ? {
		showLegend: false,
        dragRotate: false,
        scrollZoom: false,
        dragPan: false,
        height: 550,
        zoomPadding: 5,
        padding: "1em"
	}
	: {
		showLegend: false,
        dragRotate: false,
        scrollZoom: false,
        dragPan: false,
        height: 375,
        zoomPadding: 5,
        padding: "1em"
	}

const getMapWidth = numMaps =>
	numMaps == 1 ? 12
	: (numMaps % 3) === 0 ? 4
	: (numMaps === 2) || (numMaps === 4) ? 6
	: 4

class HazardEventsMapController extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			viewport: Viewport()
		}
	}

  	componentWillMount() {
	    this.props.getChildGeo('36', 'counties');
	    this.props.getGeoMesh('36', 'counties');
	    this.props.getGeoMerge('36', 'counties');
	    this.props.getChildGeo('36', 'cousubs');
  	}

  	componentDidUpdate() {
  		const { geoid, geoLevel } = this.props;
  		let geojson = null, padding = this.props.zoomPadding;
  		switch (geoLevel) {
			case 'counties':
				geojson = this.props.geo['merge']['36']['counties']
				break;
			case 'cousubs':
				padding = 20;
				geojson = this.props.geo['36']['counties'].features
						.reduce((a, c) => (c.properties.geoid == geoid) ? c : a, null);
				break;
  		}
  		this.state.viewport.fitGeojson(geojson, { padding });  			
  	}

  	fetchFalcorDeps() {
	    const { params } = createMatchSelector({ path: '/risk-index/h/:hazard' })(this.props) || { params: {} },
	     	{ hazard } = params,

	    	{ geoid, dataType, geoLevel } = this.props;

	    return this.props.falcor.get(
	      	['geo', geoid, geoLevel],
	      	['riskIndex', 'hazards']
	    ).then(falcorResponse => {
	      	const geoids = falcorResponse.json.geo[geoid][geoLevel],
	        	hazards = hazard ? [hazard] : falcorResponse.json.riskIndex.hazards,
        		requests = [];
      		// COLOR_SCALE.domain(falcorResponse.json.riskIndex.hazards);
      		for (let i = LATEST_YEAR; i >= EARLIEST_YEAR; i -= 5) {
        		requests.push([dataType, 'events', geoids, hazards, { from: Math.max(i - 4, EARLIEST_YEAR), to: i }, ['property_damage']])
      		}
	      	return requests.reduce((a, c) => a.then(() => this.props.falcor.get(c)), Promise.resolve());
	    })
  	}

	render() {
		const maps = Array(this.props.numMaps).fill(getMapWidth(this.props.numMaps))
			.map((width, n) =>
				<div className={ `col-lg-${ width }` } key={ n }>
	              	<HazardEventsMap
	              		yearDelta={ n + 1 - this.props.numMaps }
	              		geoLevel={ this.props.geoLevel }
      					geoid={ this.props.geoid }
      					dataType={ this.props.dataType }
	              		{ ...getMapDefaults(width) }
		              	viewport={ this.state.viewport }
		                colorScale={ this.props.colorScale }
		                radiusScale={ RADIUS_SCALE }/>
	            </div>
	        , this);
		return (
			<div className='row'>
				{
					this.props.showLegend ?
					<HazardEventsLegend
						viewport={ this.state.viewport }
						colorScale={ this.props.colorScale }
		                radiusScale={ RADIUS_SCALE }/>
					: null
				}
				{ maps }
			</div>
		)
	}
}
HazardEventsMapController.defaultProps = {
	geoid: '36',
	dataType: 'severeWeather',
	geoLevel: 'counties',
	numMaps: 1,
	showLegend: false,
	colorScale: COLOR_SCALE
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
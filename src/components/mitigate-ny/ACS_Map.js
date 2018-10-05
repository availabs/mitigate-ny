import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import * as d3scale from 'd3-scale'
import * as d3color from 'd3-color'
import * as d3format from "d3-format"

import * as turf from "@turf/turf"

import ElementBox from 'components/light-admin/containers/ElementBox'

import SvgMap from "components/mapping/escmap/SvgMap.react"
import Viewport from "components/mapping/escmap/Viewport"

import {
	EARLIEST_YEAR,
	LATEST_YEAR,
  YEARS_OF_ACS_DATA
} from "./yearsOfAcsData";

import {
	getChildGeo,
	getGeoMerge,
	getGeoMesh
} from 'store/modules/geo'

import {
	fnum,
	scaleCk
} from "utils/sheldusUtils"

const getScale = scaleType => {
	switch (scaleType) {
		case "quantize":
			return d3scale.scaleQuantize();
		case "quantile":
			return d3scale.scaleQuantile();
		case "threshold":
			return d3scale.scaleThreshold()
		default:
			return scaleCk();
	}
}

class ACS_Map extends React.Component {
	state = {
		hoverData: null,
		viewport: Viewport(),
		acsData: {
			type: "FeatureCollection",
			features: []
		},
		colorScale: d3scale.scaleQuantile()
			.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"]),
		acsDataProcessed: false
	}

	componentWillMount() {
		const { geoid, geoLevel } = this.props;

		this.props.getChildGeo(geoid.slice(0, 2), geoLevel);
		this.props.getChildGeo(geoid.slice(0, 2), geoLevel);
		this.props.getGeoMerge(geoid.slice(0, 2), geoLevel);
		this.props.getGeoMesh(geoid.slice(0, 2), geoLevel);
		this.props.getGeoMesh('36', 'counties');
	}

	componentDidMount() {
		this.state.viewport.register(this, this.forceUpdate, false);
	}
	componentWillunmount() {
		this.state.viewport.unregister(this);
	}

	componentWillReceiveProps() {
		if (!this.state.acsDataProcessed) {
			this.processAcsData();
		}
	}

	fetchFalcorDeps() {
		const { geoid, geoLevel, variable } = this.props;
		return this.props.falcor.get(
			['geo', geoid, geoLevel]
		)
		.then(res => res.json.geo[geoid][geoLevel])
		.then(geoids => {
			const requests = [],
				skip = 500;

			for (let i = 0; i < geoids.length; i += skip) {
				requests.push(geoids.slice(i, i + skip));
			}

			return requests.reduce((a, c) => a.then(() => this.props.falcor.get(['geo', c, LATEST_YEAR, variable], ['geo', c, 'name'])), Promise.resolve())
		})
		.then(res => this.processAcsData())
		return Promise.resolve()
	}

	processAcsData() {
		const { geoid, geoLevel, variable, density, scaleType, thresholds } = this.props,

			acsData = {
				type: "FeatureCollection",
				features: []
			},
			// colorScale = scaleCk()
			colorScale = getScale(scaleType)
				.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"]),
			domain = [];

		let min = Infinity,
			max = -Infinity,

			acsDataProcessed = false;

		if (scaleType === 'thresholds') {
			colorScale.domain(thresholds);
		}

		try {
			const features = [];
			this.props.geo[geoid][geoLevel].features.forEach(feature => {
				let geoid = feature.properties.geoid,
					data = this.props.geoGraph[geoid][LATEST_YEAR][variable];
				if (density) {
					const area = turf.area(feature);
					data /= area;
				}
				const f = {
						type: "Feature",
						properties: {
							geoid,
							[variable]: data
						},
						geometry: JSON.parse(JSON.stringify(feature.geometry))
					};
				features.push(f);
				domain.push(data);
				min = Math.min(min, data);
				max = Math.max(max, data);
			});
			acsData.features = features;
			switch (scaleType) {
				case "quantize":
					colorScale.domain([min, max]);
					break;
				case "threshold":
					colorScale.domain(thresholds);
					break;
				case "quantile":
				default:
					colorScale.domain(domain);
			}
			acsDataProcessed = true;
		}
		catch (e) {
		}
		this.setState({ acsData, colorScale, acsDataProcessed });
	}

	generateLayers() {
		const { geoid, geoLevel, variable } = this.props,

			{ acsData, colorScale } = this.state,

			getFillColor = ({ properties }) => {
				const value = properties[variable],
					color = d3color.color(colorScale(value))
				return [color.r, color.g, color.b, 255];
			};
		return [
    	{
    		id: 'ny-merge-layer-filled',
    		data: this.props.geo['merge'][geoid.slice(0, 2)][geoLevel],
    		filled: true,
    		stroked: false,
    		getFillColor: [242, 239, 233, 255],
	      pickable: false
    	},

    	{
    		id: 'acs-layer',
    		data: acsData,
    		filled: true,
    		stroked: false,
    		getFillColor,
    		pickable: false
    	},

    	{
    		id: 'ny-mesh-layer',
    		data: this.props.geo['mesh']['36']['counties'],
    		filled: false,
    		stroked: true,
    		getLineColor: [200, 200, 200, 255],
	      pickable: false
    	},
    	{
    		id: 'ny-merge-layer-stroked',
    		data: this.props.geo['merge'][geoid.slice(0, 2)][geoLevel],
    		filled: false,
    		stroked: true,
    		getLineColor: [242, 239, 233, 255],
    		lineWidthMinPixels: 2,
	      pickable: false
    	}
		]
	}

	generateLegend() {
		const { colorScale } = this.state,
			{ variable, density } = this.props,
			range = colorScale.range(),
  		width = `${ 100 / range.length }%`;
  	let format = d3format.format("0.4f");
  	if (!density) format = val => fnum(val, false);
		return (
			<table className="map-test-table">
				<thead>
					<tr>
						<th className="no-border-bottom" colSpan={ range.length }>
							{ variable } { density ? "density" : "" }
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						{
							range.map(t => <td key={ t } style={ { width, height: '10px', background: t } }/>)
						}
					</tr>
					<tr>
						{
							range.map(t => {
								const value = colorScale.invertExtent(t)[0];
								return <td key={ t } style={ { width } }>{ format(value) }</td>
							})
						}
					</tr>
				</tbody>
			</table>
		)
	}

// //
	generateControls() {
		const controls = [];

		controls.push({
			pos: "top-left",
			comp: this.generateLegend()
		})

		return controls;
	}

	render () {
  	return (
      <SvgMap layers={ this.generateLayers() }
      	viewport={ this.state.viewport }
      	hoverData={ this.state.hoverData }
      	controls={ this.generateControls() }/>
  	) 
	}
}

ACS_Map.defaultProps = {
	geoid: '36',
	geoLevel: 'counties',
	variable: 'population',
	density: false,
	scaleType: "ck",
	thresholds: []
}

const mapStateToProps = state => ({
  	router: state.router,
    geo: state.geo,
    geoGraph: state.graph.geo
})

const mapDispatchToProps = {
	getChildGeo,
	getGeoMerge,
	getGeoMesh
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ACS_Map));
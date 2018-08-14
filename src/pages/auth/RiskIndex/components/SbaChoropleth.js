import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import get from "lodash.get";

import {
	getChildGeo,
	getGeoMerge,
	getGeoMesh
} from 'store/modules/geo'

import * as d3scale from 'd3-scale'
import * as d3color from 'd3-color'
import * as d3format from "d3-format"


import DeckMap from "components/mapping/escmap/DeckMap.react"
// import MapTest from "components/mapping/escmap/MapTest.react"
import SvgMap from "components/mapping/escmap/SvgMap.react"
import Viewport from "components/mapping/escmap/Viewport"

import {
	EARLIEST_YEAR,
	LATEST_YEAR,
	YEARS_OF_SBA_LOAN_DATA
} from "./yearsOfSbaLoanData";

const format = d3format.format("$,d")

class SbaChoropleth extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			hoverData: null,
			currentYear: LATEST_YEAR,
			data: null,
			scale: d3scale.scaleThreshold()
				.domain([150000, 500000, 1000000, 5000000])
				.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"]),
			total_loss: 0,
			viewport: Viewport(),
			dataProcessed: false
		}
	}

	componentWillMount() {
		this.props.getChildGeo('36', 'zips');
		this.props.getGeoMerge('36', 'counties');
		this.props.getGeoMesh('36', 'counties');

		this.processData();
	}

	componentWillReceiveProps(newProps) {
		//this.fetchFalcorDeps();
		this.state.viewport.fitGeojson(newProps.geo['merge']['36']['counties'], { padding: 20 });
		if (!this.state.dataProcessed) {
			this.processData(this.state.currentYear, newProps);
		}
	}

	incrementCurrentYear() {
		const currentYear = Math.min(LATEST_YEAR, this.state.currentYear + 1);
		this.processData(currentYear);
	}
	decrementCurrentYear() {
		const currentYear = Math.max(EARLIEST_YEAR, this.state.currentYear - 1);
		this.processData(currentYear);
	}

	fetchFalcorDeps() {
		return this.props.falcor.get(
			['riskIndex', 'hazards']
		)
		.then(response => {
			const { hazard } = this.props
			return hazard ? [hazard] : response.json.riskIndex.hazards;
		})
		.then(hazardids => {
			const zip_codes = [...new Set(this.props.geo['36'].zips.features.map(({ properties }) => properties.geoid))];

			if (!zip_codes.length) return;
			
			let yearsOfData = { from: EARLIEST_YEAR, to: LATEST_YEAR };
			const { years } = this.props;
			if (years === "All Time") {
				yearsOfData = "allTime";
			}
			return this.props.falcor.get(
				["sba", "all", "byZip", zip_codes, hazardids, yearsOfData, 'total_loss']
			)
			// .then(data => {
			// 	console.log('got sba data', data)
			// })
		})
	}

	processData(currentYear=this.state.currentYear, props=this.props) {
		const year = (props.years === "All Time") ? "allTime" : currentYear,

			geoData = props.geo['36'].zips.features,
			data = {
				type: "FeatureCollection",
				features: []
			},

			{ hazard } = props;

		let dataProcessed = true,
			total_loss = 0;

		try {
			const hazardids = hazard ? [hazard] : props.riskIndex.hazards.value,

				sbaData = props.sba.all.byZip;

			for (const zip_code in sbaData) {
				let feature = geoData.reduce((a, c) => c.properties.geoid === zip_code ? c : a, null);
				feature = JSON.parse(JSON.stringify(feature));

				feature.properties.total_loss = 0;
				data.features.push(feature);

				hazardids.forEach(hazardid => {
					const value = +sbaData[zip_code][hazardid][year].total_loss;

					feature.properties.total_loss += value;
				})
			}
			data.features.forEach(({ properties }) => {
				total_loss += properties.total_loss;
			})
			data.features = data.features.filter(({ properties }) =>
				properties.total_loss >=  this.state.scale.domain()[0]
			)
		}
		catch (e) {
// console.log("<processData> ERROR:",e)
			dataProcessed = false;
		}
		this.setState({ currentYear, total_loss, data, dataProcessed });
	}

	generateLayers() {
		const { scale, total_loss, data } = this.state,

			getFillColor = ({ properties }) => {
				const value = get(properties, `total_loss`, 0),
					color = d3color.color(scale(value));
				return [color.r, color.g, color.b, 255];
			}

    	const layers = [
	    	{
	    		id: 'ny-merge-layer-filled',
	    		data: this.props.geo['merge']['36']['counties'],
	    		filled: true,
	    		stroked: false,
	    		getFillColor: [242, 239, 233, 255],
		      	pickable: false
	    	},
    		{ id: 'ny-zips-layer',
		      	data,
		      	getFillColor,
		      	filled: true,
		      	stroked: false,
		      	pickable: true,
		      	key: ({ properties }) => properties.geoid,

		      	// onClick: (event => {
		      	// 	const { object } = event;
		      	// 	if (object) {
		      	// 		const geoid = object.properties.geoid;
		      	// 		this.props.setGeoid(geoid);
		      	// 	}
		      	// }).bind(this),

		      	onHover: this.props.useDeck ? (event => {
		      		const { object, x, y } = event;
		      		let hoverData = null;
		      		if (object) {
		      			const total_loss = object.properties.total_loss || 0;
		      			hoverData = {
		      				rows: [
		      					['Total Loss', format(total_loss)]
		      				],
		      				x, y
		      			}
		      		}
		      		this.setState({ hoverData });
		      	}).bind(this) : null
	    	},
	    	{
	    		id: 'ny-mesh-layer',
	    		data: this.props.geo['mesh']['36']['counties'],
	    		filled: false,
	    		stroked: true,
	    		getLineColor: [0, 0, 0, 50],
		      	pickable: false
	    	},
	    	{
	    		id: 'ny-merge-layer-stroked',
	    		data: this.props.geo['merge']['36']['counties'],
	    		filled: false,
	    		stroked: true,
	    		getLineColor: [242, 239, 233, 255],
	    		lineWidthMinPixels: 2,
		      	pickable: false
	    	}
	    ]
	    return { scale, total_loss, layers };
	}

	generateLegend(scale) {
  		const range = scale.range(),
  			width = `${ 100 / range.length }%`,
  			domainValues = range.map(r => scale.invertExtent(r)[0]);
  		if (!domainValues.reduce((a, c) => a || Boolean(c), false)) return false;
		return (	
			<table className="map-test-table">
				<thead>
					<tr>
						<th className="no-border-bottom" colSpan={ range.length }>Total Losses</th>
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
							range.map(t => <td key={ t } style={ { width } }>{ format(scale.invertExtent(t)[0] || 0) }</td>)
						}
					</tr>
				</tbody>
			</table>
		)
	}
	generateMapNavigator() {
  		const { currentYear } = this.state,
  			decDisabled = (currentYear == EARLIEST_YEAR),
  			incDisabled = (currentYear == LATEST_YEAR);
		return (	
			<table className="map-test-table" style={ { tableLayout: "fixed" } }>
				<thead>
					<tr className="no-border-bottom">
						<th style={ { textAlign: "center", width: "30%" } }>
							<button className="map-test-button"
								onClick={ this.decrementCurrentYear.bind(this) }
								disabled={ decDisabled }>
								{ "<" }
							</button>
						</th>
						<th style={ { textAlign: "center", width: "40%" } }>
							{ currentYear }
						</th>
						<th style={ { textAlign: "center", width: "30%" } }>
							<button className="map-test-button"
								onClick={ this.incrementCurrentYear.bind(this) }
								disabled={ incDisabled }>
								{ ">" }
							</button>
						</th>
					</tr>
				</thead>
			</table>
		)
	}
	generateYearsToggle(toggle) {
		return (	
			<table className="map-test-table" style={ { tableLayout: "fixed" } }>
				<thead>
					<tr className="no-border-bottom">
						<th>
							<button className="map-test-button"
								onClick={ toggle }>
								{ this.props.years }
							</button>
						</th>
					</tr>
				</thead>
			</table>
		)
	}
	generateTotalLoss(total_loss) {
		return (	
			<table className="map-test-table" style={ { tableLayout: "fixed" } }>
				<thead>
					<tr className="no-border-bottom">
						<th>
							Total Loss:
						</th>
						<th>
							{ format(total_loss) }
						</th>
					</tr>
				</thead>
			</table>
		)
	}
	generateMapControls(scale, total_loss) {
		const controls = [],
			legend = this.generateLegend(scale);
		if (legend) {
			controls.push(
				{ pos: "bottom-left",
					comp: legend
				},
				{ pos: "top-left",
					comp: this.generateTotalLoss(total_loss)
				}
			)
		}
		if (this.props.years === "Individual Years") {
			controls.push(
				{ pos: "top-right",
					comp: this.generateMapNavigator()
				}
			)
		}
		if (this.props.toggle) {
			controls.push(
				{
					pos: "bottom-right",
					comp: this.generateYearsToggle(this.props.toggle)
				}
			)
		}
		return controls;
	}

  	render () {
  		const { scale, total_loss, layers } = this.generateLayers();
    	return ( this.props.useDeck ?
    		<DeckMap layers={ layers }
    			height={ this.props.height }
    			hoverData={ this.state.hoverData }
	        	viewport={ this.state.viewport }
	        	controls={ this.generateMapControls(scale, total_loss) }/>
	        : <SvgMap layers={ layers }
    			height={ this.props.height }
	        	viewport={ this.state.viewport }
	        	controls={ this.generateMapControls(scale, total_loss) }/>
    	) 
  	}
}

SbaChoropleth.defaultProps = {
	years: "All Time", // or "Individual Years"
	toggle: null,
	useDeck: false,
	height: 800
}

const mapStateToProps = state => ({
  	router: state.router,
  	riskIndex: state.graph.riskIndex,
    geo: state.geo,
    sba: state.graph.sba
})

const mapDispatchToProps = {
	getChildGeo,
	getGeoMerge,
	getGeoMesh
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(SbaChoropleth));
import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import get from "lodash.get";

import {
	fnum
}	from "utils/sheldusUtils"

import * as d3scale from 'd3-scale'
import * as d3color from 'd3-color'
import * as d3format from "d3-format"
import { set as d3set } from 'd3-collection'

import MapBoxMap from "components/mapping/escmap/MapBoxMap.react"

const formats = {
	num_losses: d => d,
	total_loss: d => fnum(d, true, true)
}

let UNIQUE_ID = 0;
const getUniqueId = () => `choropleth-${ ++UNIQUE_ID }`;
const ACTIVE_CHOROPLETHS = d3set();

class NfipChoropleth extends React.Component {

	state = {
		scale: d3scale.scaleQuantile()
					.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"]),
		hoverData: null,
		fillColor: {},
		scores: {}
	}

	componentDidMount() {
		ACTIVE_CHOROPLETHS.add(this.state.id);
	}
	componentWillUnmount() {
		ACTIVE_CHOROPLETHS.remove(this.state.id);
	}

	fetchFalcorDeps({ geoid, geoLevel, attribute }=this.props) {
		return this.props.falcor.get(
			["geo", geoid, geoLevel],
			['geo', '36', 'counties']
		)
		.then(response => response.json.geo[geoid][geoLevel])
		.then(geoids => {
			const requests = [];
			for (let i = 0; i < geoids.length; i += 500) {
				requests.push(geoids.slice(i, i + 500));
			}
			return requests.reduce((a, c) =>
				a.then(() => this.props.falcor.get(
					this.props.severe ?
						['nfip', 'severe', 'byGeoid', c, 'allTime', attribute] :
						['nfip', 'byGeoid', c, 'allTime', attribute]
				))
			, Promise.resolve())

			// return this.props.severe ?
			// 	this.props.falcor.get(
			// 		['nfip', 'severe', 'byGeoid', geoids, 'allTime', attribute]
			// 	) :
			// 	this.props.falcor.get(
			// 		['nfip', 'byGeoid', geoids, 'allTime', attribute]
			// 	);
		})
		.then(() => this.processData())
	}

	processData(props=this.props) {
		if (!ACTIVE_CHOROPLETHS.has(this.state.id)) return;

		const { geoid, geoLevel, attribute } = props;

		let scale = d3scale.scaleThreshold()
				.domain([5, 25, 100, 250])
				.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"]);

		if (attribute === 'total_loss') {
			scale = d3scale.scaleQuantile()
				.range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"]);
		}
		if ((attribute === 'num_losses') && (geoLevel === 'counties')) {
			scale.domain([25, 50, 200, 500])
		}

		try {

			const domain = [],

				fillColor = {},
				scores = {};

			props.geoGraph[geoid][geoLevel].value.forEach(geoid => {
				const d = this.props.severe ?
					props.nfip.severe.byGeoid[geoid].allTime[attribute] :
					props.nfip.byGeoid[geoid].allTime[attribute];

				if (d > 0) {
					domain.push(d);
				}
				scores[geoid] = d;
			})

			if (attribute === 'total_loss') {
				scale.domain(domain);
			}

			props.geoGraph[geoid][geoLevel].value.forEach(geoid => {
				fillColor[geoid] = scale(scores[geoid]);
			})

			this.setState({ fillColor, scores, scale })
		}
		catch (e) {
// console.log("ERROR:",e)
			this.setState({ fillColor: {}, scores: {}, scale })
		}
	}

	generateLayers() {
		const { geoid, geoLevel, attribute } = this.props,
			{ fillColor } = this.state;

    let counties = [],
      geoids = [];
    try {
      counties = this.props.geoGraph['36']['counties'].value;
      geoids = this.props.geoGraph[geoid][geoLevel].value;
    }
    catch (e) {
      counties = [];
      geoids = [];
    }

  	return [
      { id: 'states-fill',
        type: 'fill',
        geoLevel: 'states',
        geoids: ['36'],
        'fill-color': "#f2efe9"
      },

      { id: 'state-layer',
      	type: 'fill',
      	geoLevel,
      	geoids,
      	'fill-color': fillColor,
        autoHighlight: true,
        onHover: e => {
          const { object, x, y } = e;
          let hoverData = null;
          if (object ) {
          	const geoid = object.properties.geoid;
          	if ((geoid in this.state.scores) && (this.state.scores[geoid] > 0)) {
          		const rows = [
          			["Total", fnum(this.state.scores[geoid])]
          		]
	            hoverData = {
	              rows,
	              x, y
	            }
	          }
          }
          this.setState({ hoverData })
        }
      },

      { id: 'counties-line',
        type: 'line',
        geoLevel: 'counties',
        geoids: counties,
        'line-color': "#c8c8c8",
        'line-width': 1
      },
      { id: 'states-line',
        type: 'line',
        geoLevel: 'states',
        geoids: ['36'],
        'line-color': "#fff",
        'line-width': 2
      }
    ]
	}

	generateLegend(scale=this.state.scale, { attribute }=this.props) {
  		const range = scale.range(),
  			width = `${ 100 / range.length }%`,
  			domainValues = range.map(r => scale.invertExtent(r)[0]);
  		if (!domainValues.reduce((a, c) => a || Boolean(c), false)) return false;
  		const label = attribute.split("_").map(d => d.split("").map((c, i) => i === 0 ? c.toUpperCase() : c).join("")).join(" ")
		return (	
			<table className="map-test-table">
				<thead>
					<tr>
						<th className="no-border-bottom" colSpan={ range.length }>{this.props.severe ? "Severe " : "" }{ label }</th>
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
							range.map(t => <td key={ t } style={ { width } }>{ formats[attribute](scale.invertExtent(t)[0]) }</td>)
						}
					</tr>
				</tbody>
			</table>
		)
	}

// //
	generateMapControls() {
		const controls = [{
			pos: 'top-left',
			comp: this.generateLegend()
		}];
		return controls;
	}

// //
  	render () {
    	return (
    		<MapBoxMap layers={ this.generateLayers() }
    			height={ this.props.height }
    			hoverData={ this.state.hoverData }
        	controls={ this.generateMapControls() }/>
    	) 
  	}
}

// //
NfipChoropleth.defaultProps = {
	height: 800,
	geoid: '36',
	geoLevel: 'tracts',
	attribute: 'total_loss',
	severe: false
}

const mapStateToProps = state => ({
	router: state.router,
  geoGraph: state.graph.geo,
  nfip: state.graph.nfip
})

export default connect(mapStateToProps, {})(reduxFalcor(NfipChoropleth));
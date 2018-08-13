import React from 'react';
import { connect } from 'react-redux';

import { getDistanceScales } from 'viewport-mercator-project';

import * as d3scale from "d3-scale";
import * as d3color from 'd3-color';
import * as d3format from "d3-format";

import ElementBox from 'components/light-admin/containers/ElementBox'

import DeckMap from "components/mapping/escmap/DeckMap.react"
import MapTest from "components/mapping/escmap/MapTest.react"
import SvgMap from "components/mapping/escmap/SvgMap.react"

import { CircleLabel } from "./HazardEventsLegend"

import {
  EARLIEST_YEAR,
  LATEST_YEAR
} from "./yearsOfSevereWeatherData";

class HazardEventsMap extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentYear: LATEST_YEAR + props.yearDelta
		}
	}

  	componentDidMount() {
		this.props.viewport.register(this, this.setState);
  	}
  	componentWillUnmount() {
    	this.props.viewport.unregister(this);
  	}

	decrementCurrentPopulationYear() {
		const currentYear = Math.max(EARLIEST_YEAR, this.state.currentYear - 1);
		this.setState({ currentYear });
	}
	incrementCurrentPopulationYear() {
		const currentYear = Math.min(LATEST_YEAR, this.state.currentYear + 1);
		this.setState({ currentYear });
	}
	generateMapNavigator() {
  		const currentYear = this.state.currentYear,
  			decDisabled = (currentYear == EARLIEST_YEAR),
  			incDisabled = (currentYear == LATEST_YEAR);
		return (
			<table className="map-test-table" style={ { tableLayout: "fixed" } }>
				<tbody>
					<tr className="no-border-bottom">
						<th style={ { textAlign: "center", width: "30%" } }>
							<button className="map-test-button"
								onClick={ this.decrementCurrentPopulationYear.bind(this) }
								disabled={ decDisabled }>
								{ "<" }
							</button>
						</th>
						<th style={ { textAlign: "center", width: "40%" } }>
							{ currentYear }
						</th>
						<th style={ { textAlign: "center", width: "30%" } }>
							<button className="map-test-button"
								onClick={ this.incrementCurrentPopulationYear.bind(this) }
								disabled={ incDisabled }>
								{ ">" }
							</button>
						</th>
					</tr>
				</tbody>
			</table>
		)
	}
	generateLegend() {
		const distanceScales = getDistanceScales(this.props.viewport());
		return (
			<table className="map-test-table" style={ { tableLayout: "fixed", width: "300px" } }>
				<thead>
					<tr><th>Property Damage</th></tr>
				</thead>
				<tbody>
					<tr>
						<td style={ { position: "relative", height: "120px" } }>

							<CircleLabel radius={ 40 } color={ "#fff" }
								value={ this.props.radiusScale.invert(distanceScales.metersPerPixel[0] * 40 / 1000) }/>
							<CircleLabel radius={ 30 } color={ "#fff" }
								value={ this.props.radiusScale.invert(distanceScales.metersPerPixel[0] * 30 / 1000) }/>
							<CircleLabel radius={ 10 } color={ "#fff" }
								value={ this.props.radiusScale.invert(distanceScales.metersPerPixel[0] * 10 / 1000) }/>

						</td>
					</tr>
				</tbody>
			</table>
		)
	}
	generateSmallLegend() {
		const distanceScales = getDistanceScales(this.props.viewport());
		return (
			<table className="map-test-table" style={ { tableLayout: "fixed", width: "300px" } }>
				<thead>
					<tr><th>Property Damage</th></tr>
				</thead>
				<tbody>
					<tr>
						<td style={ { position: "relative", height: "90px" } }>

							<CircleLabel radius={ 25 } color={ "#fff" }
								value={ this.props.radiusScale.invert(distanceScales.metersPerPixel[0] * 40 / 1000) }/>
							<CircleLabel radius={ 15 } color={ "#fff" }
								value={ this.props.radiusScale.invert(distanceScales.metersPerPixel[0] * 30 / 1000) }/>
							<CircleLabel radius={ 5 } color={ "#fff" }
								value={ this.props.radiusScale.invert(distanceScales.metersPerPixel[0] * 10 / 1000) }/>

						</td>
					</tr>
				</tbody>
			</table>
		)
	}
	generateMapControls() {
		const controls = [];
		if (this.props.showLegend) {
			controls.push(
				{ pos: this.props.mapLegendLocation,
					comp: (this.props.mapLegendSize == "large") ? this.generateLegend() : this.generateSmallLegend()
				}
			)
		}
		controls.push(
			{ pos: this.props.mapControlsLocation,
				comp: this.generateMapNavigator()
			}
		)
		return controls;
	}
	generateLayers() {
	    const { colorScale } = this.props,

			data = {
				type: "FeatureCollection",
				features: []
			};

		try {
	  		const { geoid, dataType, geoLevel, hazard, eventsData } = this.props,

		    	hazards = hazard ? [hazard] : this.props.riskIndex.hazards.value;

		    for (const gid in eventsData[geoid][geoLevel]) {
		    	hazards.forEach(hazard => {
		    		data.features.push(...eventsData[geoid][geoLevel][gid][hazard][this.state.currentYear])
		    	}, this)
		    }

			const getLineColor = ({ properties }) => {
				const hexColor = colorScale(properties.hazard),
					rgbColor = d3color.rgb(hexColor);
				return [rgbColor.r, rgbColor.g, rgbColor.b, 255];
			}
			return [
				{ id: 'counties-merge-layer',
					data: this.props.geo['merge']['36']['counties'],
					filled: true,
					getFillColor: [225, 225, 225, 255]
				},
				{ id: 'counties-mesh-layer',
					data: this.props.geo['mesh']['36']['counties'],
					filled: false,
					getLineColor: [255, 255, 255, 255],
					lineWidthMinPixels: 2
				},
				{ id: 'events-layer',
					data,
					stroked: true,
					getLineColor,
					filled: false,
					pickable: false
				}
			];
		}
		catch (e) {
			return []
		}
	}
  	render () {
    	return (
      		<ElementBox style={ { padding: this.props.padding } }>
		        <SvgMap layers={ this.generateLayers() }
		        	height={ this.props.height }
		        	viewport={ this.props.viewport }
		        	controls={ this.generateMapControls() }
		        	padding={ this.props.zoomPadding }
		        	bounds={ this.props.bounds }/>
      		</ElementBox>
    	) 
  	}
}

HazardEventsMap.defaultProps = {
	yearDelta: 0,
	height: 800,
	dragPan: true,
	scrollZoom: true,
	dragRotate: true,
	padding: null,
    mapLegendLocation: "top-right",
    mapLegendSize: "large",
    mapControlsLocation: "top-left",
    hazard: null
}

const mapStateToProps = state => ({
  	router: state.router,
    geo: state.geo,
    geoGraph: state.graph.geo,
    severeWeather: state.graph.severeWeather,
    riskIndex: state.graph.riskIndex
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HazardEventsMap);
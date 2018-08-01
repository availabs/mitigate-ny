import React from 'react';
import { connect } from 'react-redux';

import { getDistanceScales } from 'viewport-mercator-project';

import { createMatchSelector } from 'react-router-redux';

import * as d3scale from "d3-scale";
import * as d3color from 'd3-color';
import * as d3format from "d3-format";

import * as turf from "@turf/turf"

import ElementBox from 'components/light-admin/containers/ElementBox'

import MapTest from "components/mapping/escmap/MapTest.react"

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
		if (this.props.showLegend) {
			this.props.viewport.register(this, this.setState);
		}
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
	generateMapControls() {
		const controls = [];
		if (this.props.showLegend) {
			controls.push(
				{ pos: "top-right",
					comp: this.generateLegend()
				}
			)
		}
		controls.push(
			{ pos: "top-left",
				comp: this.generateMapNavigator()
			}
		)
		return controls;
	}
	generateLayer() {
	    const { params } = createMatchSelector({ path: '/risk-index/h/:hazard' })(this.props) || { params: {} },
	     	{ hazard } = params,

	     	{ currentYear } = this.state,

			{ geoid, dataType, geoLevel, radiusScale, colorScale } = this.props,

			features = this.props.geo['36'][geoLevel].features,

			data = {
				type: "FeatureCollection",
				features: []
			};

		try {
			const allHazards = this.props.riskIndex.hazards.value,
				hazards = hazard ? [hazard] : allHazards;

			this.props.geoGraph[geoid][geoLevel].value
				.forEach(geoid => {
					hazards.forEach(hazard => {
						const events = this.props[dataType].events[geoid][hazard][currentYear]["property_damage"].value;

						if (events.length) {
							const feature = features.reduce((a, c) => c.properties.geoid === geoid ? c : a);

							events.forEach(event => {
								const property_damage = +event.property_damage,
									geom = event.geom,

									properties = { property_damage, hazard };

								let circle;

								if ((property_damage < radiusScale.domain()[0]) &&
									(geoLevel === "counties")) return;

								if (geom) {
									circle = turf.circle(JSON.parse(geom).coordinates, radiusScale(property_damage), { units: "kilometers", properties });
								}
								else {
									const centroid = turf.centroid(feature);
									circle = turf.circle(centroid.geometry.coordinates, radiusScale(property_damage), { units: "kilometers", properties });
								}
								if (circle) data.features.push(circle);
							})
						}
					})
				})

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
		        <MapTest layers={ this.generateLayer() }
		        	controls={ this.generateMapControls() }
		        	viewport={ this.props.viewport }
		        	height={ this.props.height }
		        	dragPan={ this.props.dragPan }
		        	scrollZoom={ this.props.scrollZoom }
		        	dragRotate={ this.props.dragRotate }
		        	style={ "" }/>
      		</ElementBox>
    	) 
  	}
}

HazardEventsMap.defaultProps = {
	yearDelta: 0,
	height: 800,
	zoomPadding: 20,
	dragPan: true,
	scrollZoom: true,
	dragRotate: true,
	padding: null
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
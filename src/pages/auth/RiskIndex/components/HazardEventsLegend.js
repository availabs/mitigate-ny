import React from 'react';

import WebMercatorViewport, { getDistanceScales } from 'viewport-mercator-project';

import * as d3format from "d3-format"

import ElementBox from 'components/light-admin/containers/ElementBox'

import TableBox from 'components/light-admin/tables/TableBox'

import { getHazardName } from 'utils/sheldusUtils'

const format = d3format.format(",.0f")

export const CircleDiv = ({ color="#000", radius=10, thickness=2, children=null, style={} }) =>
	<div style={ { height: `${ radius * 2 }px`, width: `${ radius * 2 }px`, borderRadius: `${ radius }px`, border: `${ thickness }px solid ${ color }`, display: "inline-block", ...style } }>
		{ children }
	</div>

export const CircleLabel = ({ center="25%", bottom=20, radius, value, color="#000" }) =>
	<CircleDiv radius={ radius } thickness={ 1 } color={ color } style={ { position: "absolute", left: `calc(${ center } - ${ radius }px)`, bottom: `${ bottom }px` } }>
		<span style={ { width: "100px", position: "absolute", left: `${ radius }px`, bottom: `${ radius * 2 - 2 }px`, borderBottom: `1px dashed ${ color }` } }/>
		<span style={ { color: color, position: "absolute", left: `${ radius + 110 }px`, bottom: `${ radius * 2 - 12 }px` } }>
			${ format(value) }
		</span>
	</CircleDiv>

export default class HazardEventsLegend extends React.Component {

	componentDidMount() {
		this.props.viewport.register(this, this.setState);
	}	
	componentWillUnmount() {
		this.props.viewport.unregister(this);
	}

	render() {
		const { colorScale, radiusScale, viewport } = this.props;
		const distanceScales = getDistanceScales(viewport()),
			domain = colorScale.domain(),
			rows = [],

			numRows = 3,
			numCols = Math.ceil(domain.length / numRows);

		for (let r = 0; r < numRows; ++r) {
			const columns = [];
			for (let c = 0; c < numCols; ++c) {
				const i = (r * numCols) + c;
				columns.push(
					<td key={ `row-${ r }-column-${ c }` }
						style={ { color: colorScale(domain[i]), backgroundColor: "rgb(225, 225, 225)", border: "2px solid #fff", padding: "10px 0px 0px 15px" } }>
						<CircleDiv color={ colorScale(domain[i]) }/>
						<div style={ { padding: "0px 10px", display: "inline-block", fontSize: "18px" } }>
							{ domain[i] ? getHazardName(domain[i]) : null }
						</div>
					</td>
				)
			}
			rows.push(
				<tr key={ `row-${ r }` }>
					{ columns }
				</tr>
			)
		}

		return (
			<div className="col-lg-12">
				<ElementBox>
					<table style={ { width: "70%", display: "inline-block", tableLayout: "fixed" } }>
						<tbody>
							{ rows }
						</tbody>
					</table>
					<div style={ { height: "100%", width: "30%", display: "inline-block", position: "relative" } }>

						<div style={ { width: "100%", borderBottom: "2px solid #000", bottom: "100px", position: "absolute", fontSize: "18px" } }>
							Property Damage
						</div>

						<CircleLabel bottom={ 0 } radius={ 40 } value={ radiusScale.invert(distanceScales.metersPerPixel[0] * 40 / 1000) }/>
						<CircleLabel bottom={ 0 } radius={ 30 } value={ radiusScale.invert(distanceScales.metersPerPixel[0] * 30 / 1000) }/>
						<CircleLabel bottom={ 0 } radius={ 10 } value={ radiusScale.invert(distanceScales.metersPerPixel[0] * 10 / 1000) }/>

					</div>
				</ElementBox>
			</div>
		)
	}
}
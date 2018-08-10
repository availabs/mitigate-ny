import React from "react"

import * as d3color from "d3-color"
import * as d3geo from "d3-geo"
import * as d3projection from "d3-geo-projection";

class SvgMap extends React.Component {
	constructor(props) {
		super(props);

		const projection = d3geo.geoMercator()
		this.state = {
			projection,
			path: d3geo.geoPath(projection)
		}
	}

	getPath(data, {
			stroked=true,
			lineWidthMinPixels=1,
			filled=false,
			getLineColor=[0, 0, 0, 255],
			getFillColor=[225, 225, 225, 255]
		}, i) {
		let lineColor = getLineColor,
			fillColor = getFillColor;
		if (typeof getLineColor === "function") {
			lineColor = getLineColor(data);
		}
		if (typeof getFillColor === "function") {
			lineColor = getFillColor(data);
		}
		lineColor = d3color.color(
			`rgba(
				${lineColor[0]},
				${lineColor[1]},
				${lineColor[2]},
				${255/lineColor[3]}
			)`
		)
		fillColor = d3color.color(
			`rgba(
				${fillColor[0]},
				${fillColor[1]},
				${fillColor[2]},
				${255/fillColor[3]}
			)`
		)
		return <path d={ this.state.path(data) }
					key={ i }
					stroke={ stroked ? lineColor.toString() : "none" }
					fill={ filled ? fillColor.toString() : "none" }
					strokeWidth={ lineWidthMinPixels }/>
	}
	getLayerPaths({ data, ...rest }) {
		if ("features" in data) {
			return data.features.map((feature, i) =>
				this.getPath(feature, rest, i)
			);
		}
		else {
			return this.getPath(data, rest);
		}
	}
	render() {
		const {
			width,
			height,

			longitude,
			latitude,
			zoom,

			bounds,

			padding,

			layers,
			controls
		} = this.props;
		const {
			projection,
			path
		} = this.state;
		if (!bounds && layers.length) {
			projection.fitExtent(
				[[padding, padding], [width-padding, height-padding]],
				layers[0].data
			)
		}
		else if (bounds) {
			projection.fitExtent(
				[[padding, padding], [width-padding, height-padding]],
				bounds
			)
		}

		return (
			<div style={ { position: "absolute" } }>
				<svg style={ {
						width: `${ width }px`,
						height: `${ height }px`,
					} }>
					{
						layers.map(layer => {
							return (
								<g id={ layer.id } key={ layer.id }>
									{ this.getLayerPaths(layer) }
								</g>
							)
						})
					}
				</svg>
				{
					controls.map((control, i) => <MapControl key={ i } { ...control }/>)
				}
			</div>
		)
	}
}
SvgMap.defaultProps = {
	layers: [],
	controls: [],
	padding: 20
}

const MapControl = ({ comp, pos="top-left" }) => {
	return (
		<div className={ "map-test-table-div " + pos }>
			{ comp }
		</div>
	)
}

export default SvgMap
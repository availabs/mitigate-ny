import React from "react"

import * as d3color from "d3-color"
import * as d3geo from "d3-geo"
import * as d3projection from "d3-geo-projection";

import Viewport from "./Viewport"

let UNIQUE_IDs = 0;
const getUniqueId = () => `svg-map-${ ++UNIQUE_IDs }`;

class SvgMap extends React.Component {
	constructor(props) {
		super(props);

		const projection = d3geo.geoMercator()
		this.state = {
			projection,
			path: d3geo.geoPath(projection),
			id: props.id || getUniqueId(),
			viewport: this.props.viewport()
		}

		this._onViewportChange = this._onViewportChange.bind(this);
		this._resize = this._resize.bind(this);
	}

  	componentDidMount() {
    	window.addEventListener('resize', this._resize);
		this.props.viewport.register(this, this.setState);
    	this._resize();
  	}
  	componentWillUnmount() {
    	window.removeEventListener('resize', this._resize);
    	this.props.viewport.unregister(this);
  	}

  	_resize() {
    	let style = window.getComputedStyle(document.getElementById(this.state.id), null);
    	this._onViewportChange({
      		height: parseInt(style.getPropertyValue('height'), 10),
      		width: parseInt(style.getPropertyValue('width'), 10)
    	})
  	}
  	_onViewportChange(viewport) {
  		this.props.viewport.onViewportChange(viewport);
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
			projection,
			path,
			viewport
		} = this.state;
		const {
			width,
			height
		} = viewport;
		const {
			bounds,
			padding,

			layers,
			controls
		} = this.props;
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
      		<div id={ this.state.id } style={ { width: '100%', height: `${ this.props.height }px`, position: "relative" } }>
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
			</div>
		)
	}
}
SvgMap.defaultProps = {
	layers: [],
	controls: [],
	padding: 20,
	height: 800,
	viewport: Viewport()
}

const MapControl = ({ comp, pos="top-left" }) => {
	return (
		<div className={ "map-test-table-div " + pos }>
			{ comp }
		</div>
	)
}

export default SvgMap
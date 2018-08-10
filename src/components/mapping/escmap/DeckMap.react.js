import React from "react"
import DeckGL from 'deck.gl';

import GeojsonLayer from "./GeojsonLayer"
import Viewport from "./Viewport"

let UNIQUE_IDs = 0;
const getUniqueId = () => `deck-gl-map-${ ++UNIQUE_IDs }`;

class SvgMap extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
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

	render() {
		const layers = this.props.layers.map(layer => new GeojsonLayer(layer));
		return (
      		<div id={ this.state.id } style={ { width: '100%', height: `${ this.props.height }px`, position: "relative" } }>
				<DeckGL { ...this.state.viewport }
					layers={ layers }/>
				{
					this.props.controls.map((control, i) => <MapControl key={ i } { ...control }/>)
				}
			</div>
		)
	}
}
SvgMap.defaultProps = {
	layers: [],
	controls: [],
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
import React from 'react';
import { connect } from 'react-redux';

import {
	map as d3map,
	set as d3set
} from 'd3-collection'

import mapboxgl from 'mapbox-gl'
import { MAPBOX_TOKEN } from 'store/config'
mapboxgl.accessToken = MAPBOX_TOKEN

const SOURCES = {
  counties: 'am3081.1ggw4eku',
  cousubs: 'am3081.dlnvkxdi',
  zipcodes: 'am3081.5g46sdxi',
  tracts: 'am3081.92hcxki8',
  states: 'am3081.2l2cma38'
}

let UNIQUE_ID = 0;
const getUniqueId = () => `mapbox-map-${ ++UNIQUE_ID }`

const getType = layer =>
	layer.filled ? 'fill' : 'line'
const getPaint = layer => {
	const paint = {};
	switch (layer.type) {
		case 'line':
			paint['line-width'] = layer['line-width'] || 1
			if (typeof layer['line-color'] === 'string') {
				paint['line-color'] = layer['line-color'];
			}
			else {
				paint['line-color'] = [
					"get",
					["get", "geoid"],
					["lieral", layer['line-color']]
				]
			}
			return paint;
		case 'fill':
			if (typeof layer['fill-color'] === 'string') {
				paint['fill-color'] = layer['fill-color'];
			}
			else {
				paint['fill-color'] = [
					"get",
					["get", "geoid"],
					["literal", layer['fill-color']]
				]
			}
			return paint;
	}
}
const getLayerData = layer => {
	const data = {
		id: layer.id,
		type: layer.type,
		type: layer.type,
		source: layer.geoLevel,
		'source-layer': layer.geoLevel,
		paint: getPaint(layer)
	}
	if (layer.geoids) {
		data.filter = ['in', 'geoid', ...layer.geoids];
	}
	return data;
}

class MapBoxMap extends React.Component {
	state = {
		id: getUniqueId(),
		glMap: null
	}
	componentDidMount() {
		const glMap = new mapboxgl.Map({
			container: this.state.id,
			style: this.props.style,
			zoom: 6,
			center: [-75.250, 42.860]
		});
		glMap.on('load', e => {
			Object.keys(SOURCES).forEach(geoLevel => {
				glMap.addSource(geoLevel, {
					type: "vector",
					url: `mapbox://${ SOURCES[geoLevel] }`
				})
			})
	    this.setState({ glMap })
		})
		glMap.on('sourcedata', e => {
			this.forceUpdate();
		})
	}
	componentDidUpdate(oldProps) {
		this.updateLayers(oldProps);
	}
	updateLayers(oldProps) {
		const glMap = this.state.glMap;
		if (!glMap) return;

		const oldLayers = d3set();
		oldProps.layers.forEach(({ id }) => {
			oldLayers.add(id);
		})

		this.props.layers.forEach(layer => {
			if (!glMap.getLayer(layer.id) && glMap.getSource(layer.geoLevel)) {
				glMap.addLayer(getLayerData(layer));
				if (layer.onMouseover) {
					glMap.on("mouseover", layer.id, layer.onMouseover)
				}
			}
			oldLayers.remove(layer.id);
		})

		oldLayers.each(id => {
			glMap.removeLayer(id);
		})
	}
	render() {
		return (
			<div id={ this.state.id }
				style={ { height: `${ this.props.height }px` } }/>
		)
	}
}

MapBoxMap.defaultProps = {
	style: 'mapbox://styles/am3081/cjo7cnvsd2bsm2rkftn4njgee',
	height: 800,
	layers: [
		{ id: 'states-fill',
			geoLevel: 'states',
			type: 'fill',
			'fill-color': "#f2efe9",
			geoids: ['36']
		},
		{ id: 'counties-fill',
			geoLevel: 'counties',
			type: 'fill',
			'fill-color': {
				'36001': '#f00',
				'36011': '#0f0'
			},
			geoids: ['36001', '36011']
		},
		{ id: 'counties-line',
			geoLevel: 'counties',
			type: 'line',
			'line-color': "#c8c8c8",
			'line-width': 2,
			geoids: ['36001', '36011']
		},
		{ id: 'states-line',
			geoLevel: 'states',
			type: 'line',
			'line-color': "#fff",
			'line-width': 2,
			geoids: ['36']
		}
	]
}

export default MapBoxMap
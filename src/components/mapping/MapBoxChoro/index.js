import React, { Component } from 'react';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import { MAPBOX_TOKEN } from 'store/config'

let UNIQUE_ID = 0;
const getUniqueId = () =>
	`avl-map-${ ++UNIQUE_ID }`

class AvlMap extends React.Component {
  constructor(props) {
    super(props);
  	this.state = {
  		map: null,
  		popover: {
  			pos: [0, 0],
  			pinned: false,
  			data: []
  		},
  		dragging: null,
  		dragover: null,
      	width: 0,
     	height: 0
  	}
    this.container = React.createRef();
  }

  componentDidMount() {
    const {
    	id,
    	style,
    	center,
    	minZoom,
    	zoom
    } = this.props;
    const map = new mapboxgl.Map({
      container: id,
      style,
      center,
      minZoom,
      zoom
    });
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    map.boxZoom.disable();
    map.scrollZoom.disable();
    map.on('load',  () => {
      const activeLayers = [];
      // this.props.layers.forEach(layer => {
        
      // 	}
      // })
      this.setState({ map, activeLayers })
    })
    this.setContainerSize();
  }

  componentDidUpdate(oldProps, oldState) {
    this.setContainerSize();
  }

  setContainerSize() {
    const div = this.container.current,
      width = div.scrollWidth,
      height = div.scrollHeight;
    if ((width !== this.state.width) || (height !== this.state.height)) {
      this.setState({ width, height })
    }
  }
  render() {
		return (
			<div id={ this.props.id } style={ { height: this.props.height } } ref={ this.container }>
			</div>
		)
	}
}

AvlMap.defaultProps = {
	id: getUniqueId(),
	height: "100%",
	style: 'none',
	center: [-73.680647, 42.68],
	minZoom: 2,
	zoom: 10,
	layers: [],
	
}	

export default AvlMap
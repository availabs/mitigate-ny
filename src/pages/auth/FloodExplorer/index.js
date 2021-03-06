import React, {Component} from 'react';

// import { selectTMCs, setInspectTMC } from './store/MapStore'

import deepEqual from 'deep-equal'
import {MAPBOX_TOKEN} from 'store/config'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'

import { connect } from 'react-redux';

// import Sidebar from './components/sidebar'
// import Infobox from './components/infobox/Infobox'
// import SliderContainer from './components/slider/slider-container'

// import './incidents.css'

let map = null

class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapId: this.props.mapId || 'map1'
    };
  }

  shouldComponentUpdate(nextProps,nextState) {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
    mapboxgl.accessToken = MAPBOX_TOKEN
    map = new mapboxgl.Map({
      container: this.state.mapId,
      style: 'mapbox://styles/am3081/cjnacvmc84qi72rqgsfkivtup',
      center: [-75.250, 42.860],
      // minZoom: ,
      zoom: 6.5
    });
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    map.on('load', function() {

      map.addLayer({
        id: 'ogsassets-rated',
        type: 'circle',
        source: {
          type: 'vector',
          url: 'mapbox://am3081.9nklwcow'
        },
        'source-layer': 'ogsassets',
        paint: {
          'circle-radius': 3,
          'circle-opacity': 0.8,
          'circle-color': 'rgb(171, 72, 33)'
        }
      });
    });
    // map.on('load',  () => {
    //   map.addSource("npmrds", {
    //       type: 'vector',
    //       url: 'mapbox://am3081.bwf8aacc'
    //   }); 
      
    // })
    
      
    
  }

  _resize() {
    let style = window.getComputedStyle(document.getElementById(this.state.mapId), null)
  }
 
  render() {
    return (
      <div id={this.state.mapId} style={{width: '100%', height: '100vh'}}> 
      </div>
    );
  }
}

const mapDispatchToProps = { 
  
};

const mapStateToProps = state => {
  return {
  };
};

export default {
	icon: 'os-icon-share',
	path: '/flood',
	exact: true,
	mainNav: false,
  menuSettings: {
    image: 'none',
    noFooter: true,
    scheme: 'color-scheme-light', 
    position: 'menu-position-top',
    layout: 'menu-layout-full',
    style: 'color-style-default'  
  },
  name: 'MapView',
	auth: false,
	component: connect(mapStateToProps, mapDispatchToProps)(MapView)
}


import React, { Component } from 'react';
// import { Link } from 'react-router-dom'
import {Stickyroll} from '@stickyroll/stickyroll';

import {Pagers, Skip} from "@stickyroll/pagers";
import {Inner, Content} from "@stickyroll/inner";

import styled from "styled-components";
import AvlMap from 'components/AvlMap'

import TractsLayer from './layers/TractsLayer'
import HazardTotalGraph from './components/HazardTotalGraph'
// import { connect } from 'react-redux';

// const Section = styled.div

const headlines = [
    "Hello World!",
    "Hello React!",
    "Hello Stickyroll!",
    "Let's continue with the next lesson!"
]

const HazardComponent = (props) => (
  <div style={{height: '100vh', backgroundColor: '#fefefe', maxWidth: '50vw'}} >
      <div style={{padding: 20, }}>
        <h1> Historical Risk </h1>
      
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        
        </div>
       
  </div>
);

const PlaceComponent = (props) => (
  
    <div style={{height: '100vh', backgroundColor: '#fefefe', width: '50vw'}}>
      <div style={{padding: 20, position: 'relative'}}>
        <h1> Hazard Risk </h1>
        <HazardTotalGraph setHazard={props.setHazard} />
      </div>
    </div>
      

);

let PageList = [
  PlaceComponent,
  HazardComponent
]

class Home extends Component {

  setHazard (hazard) {
    console.log('set hazard',hazard)

  }

  render () {
   return (
      <div>
        <div style={{height: '100vh', backgroundColor: '#fefefe'}}>
          <h1 style={{padding: '25%'}}>Risk</h1>
        </div>
        <Stickyroll pages={PageList}>
            {({page, pageIndex, pages, progress}) => {
              let Content = PageList[pageIndex]
              return (
                <div>
                  <Pagers useContext={true} />
                  <div style={{width: '100%', height: '100vh', display: 'flex', alignContent: 'stretch', alignItems:'stretch', marginLeft: 40}}>
                    <Content progress={progress} setHazard={this.setHazard} />
                    <div style={{height: '100vh', backgroundColor: '#efefef', width: '50%'}}>
                      <AvlMap 
                        sidebar={false}
                        scrollZoom={false}
                        zoom={6}
                        style={'mapbox://styles/am3081/cjt7mqq7b2r5f1fo0iw1zzgu7'}
                        fitBounds={[
                        [
                          -79.8046875,
                          40.538851525354666
                        ],
                        [
                          -71.7626953125,
                          45.042478050891546
                        ]]}
                        layers={[TractsLayer]}
                      />
                    </div>
                  </div>
                </div>
              );
            }}
        </Stickyroll>
      </div>
    )
  }
}

export default {
	icon: 'icon-map',
	path: '/analysis',
	name: 'Design Tests',
  exact: true,
  mainNav: false,
  menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
	name: 'Home',
	auth: false,
	component: Home
}

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

let backgroundCss = {
  background: '#1a2247',
  backgroundImage: 'radial-gradient(ellipse at center,#1a2247 0,#040b33 100%)',
  backgroundSize: '100vw 100vh',
  backgroundAttachment: 'fixed'
}

const headlines = [
    "Hello World!",
    "Hello React!",
    "Hello Stickyroll!",
    "Let's continue with the next lesson!"
]

const HazardComponent = (props) => (
  <div style={{height: '100vh', maxWidth: '50vw'}} >
      <div style={{padding: 20, color: '#efefef' }}>
        <h1> Historical Risk </h1>
      
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        
        </div>
       
  </div>
);

const PlaceComponent = (props) => (
  
    <div style={{height: '100vh', width: '50vw'}}>
      <div style={{padding: 20, position: 'relative'}}>
        <h1 style={{color: '#efefef'}}> Hazard Risk <span style={{fontSize: '14px'}}> Annual Average Loss by Hazard Type (1996-2017)</span> </h1>
        <HazardTotalGraph setHazard={props.setHazard} />
      </div>
    </div>
      

);

let PageList = [
  PlaceComponent,
  HazardComponent
]


class Home extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { update: {
      layer: 'Tracts Layer',
      filter: 'hazard',
      value: 'huricane'
    } };
    this.setHazard = this.setHazard.bind(this);
  }
  
  setHazard (hazard) {
    if(this.state.update.value !== hazard){
      let update = Object.assign({}, this.state.update);    //creating copy of object
      update.value = hazard  //updating value
      this.setState({update})
    }
  
    
  }


  render () {
   return (
      <div style={{background:  'linear-gradient(120deg, rgba(35,62,144,1) 0%, rgba(35,62,144,1) 35%, rgba(0,71,187,1) 100%)'}}>
        <div style={{height: '100vh'}}>
          <h1 style={{padding: '25%', color:'#efefef'}}>Risk</h1>
        </div>
        <Stickyroll pages={PageList}>
            {({page, pageIndex, pages, progress}) => {
              let Content = PageList[pageIndex]
              return (
                <div style={backgroundCss}>
                  <Pagers useContext={true} />
                  <div style={{width: '100%', height: '100vh', display: 'flex', alignContent: 'stretch', alignItems:'stretch', marginLeft: 40}}>
                    <Content progress={progress} setHazard={this.setHazard} />
                    <div style={{height: '100vh', width: '50%'}}>
                      <AvlMap 
                        sidebar={false}
                        scrollZoom={false}
                        zoom={6}
                        update={[this.state.update]}
                        style={'mapbox://styles/am3081/cjvih8vrm0bgu1cmey0vem4ia'}
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
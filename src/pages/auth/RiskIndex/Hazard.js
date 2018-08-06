import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createMatchSelector } from 'react-router-redux'

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import Content from 'components/cms/Content'
import HazardList from './components/HazardList'
import HazardScoreTable from './components/HazardScoreTable'
import HazardMap from './components/HazardMap'

import HazardEventsMapController from "./components/HazardEventsMapController"
import FemaDisasterDeclarationsTable from "./components/FemaDisasterDeclarationsTable"
import HazardEventsTable from "./components/HazardEventsTable"

class Hazard extends Component {

  render () {
    const { params } = createMatchSelector({ path: '/hazards/:hazard' })(this.props) || {};
    let hazard = params && params.hazard ? params.hazard : null
    
    if(!hazard) return null

    return (
      <div className='property-single'>

        <div className='property-info-w'>
          <div className="property-info-main">
            
            <h1>{hazard}</h1>
            
            <div className="property-section">
              <Content content_id={`${hazard}-definition`} />
            </div>
            
            <div className="property-section">
              <Content content_id={`${hazard}-characteristics`} />
            </div>
            
            <div className="property-section">
              <Content content_id={`${hazard}-vulnerability`} />
            </div>
            
            <div className="property-section">
              <Content content_id={`${hazard}-magnitude`} />
            </div>

            <div className="property-section">
              <Content content_id={`${hazard}-location`} />
              <HazardScoreTable />
            </div>
            
          </div>
          <div className='property-info-side' style={{maxWidth: 398}}>
            <div className='side-section-content'>

              <HazardList display={'full'} size={12} dataType={'severeWeather'}/>

              <HazardEventsMapController
                mapLegendLocation="top-center"
                mapLegendSize="small"
                mapControlsLocation="bottom-left"
                mapHeight="600"/>

            </div>
          </div>
        </div>

      <div className='row'>
        <div className='col-lg-12'>
         <HazardMap />
        </div>
      </div>

      <div className='row'>
        <div className='col-lg-12'>
         <FemaDisasterDeclarationsTable />
        </div>
      </div>

      <div className='row'>
        <div className='col-lg-12'>
         <HazardEventsTable />
        </div>
      </div>
      
    </div>
    )
  }
}

const mapDispatchToProps = { };

const mapStateToProps = state => {
  return {
    riskIndex: state.riskIndex,
    router: state.router
  };
};


export default [
  {
    path: '/hazards/:hazard',
    auth: true,
    breadcrumbs: [
      {name: 'Hazard', path: '/hazards'},
      {param: 'hazard', path: '/hazards/'}
    ],
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: connect(mapStateToProps, mapDispatchToProps)(Hazard)
  }
]


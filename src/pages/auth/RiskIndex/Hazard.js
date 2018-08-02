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

class Hazard extends Component {

  render () {
    const { params } = createMatchSelector({ path: '/risk-index/h/:hazard' })(this.props) || {};
    return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">
            
            <h1>{params && params.hazard ? params.hazard : ''}</h1>
            <div className="property-section">
              <Content content_id={`${params.hazard}-definition`} />
            </div>
            <div className="property-section">
              <Content content_id={`${params.hazard}-location`} />
            </div>
            <div className="property-section">
              <Content content_id={`${params.hazard}-magnitude`} />
            </div>
            <div className="property-section">
              <Content content_id={`${params.hazard}-vulnerablity`} />
              <HazardScoreTable />
            </div>
            
          </div>
          <div className='property-info-side' style={{maxWidth: 398}}>
            <div className='side-section-content'>

              <HazardList display={'full'} size={12} dataType={'severeWeather'}/>
              <HazardEventsMapController />
              
            </div>
          </div>
        </div>
      
       
      <div className='row'>
        <div className='col-lg-12'>
         <HazardMap />
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
    path: '/risk-index/h/:hazard',
    subMenus: [],
    name: 'Risk Index',
    auth: true,
    breadcrumbs: [
      {name: 'RISK INDEX', path: '/risk-index'},
      {param: 'hazard', path: '/risk-index/h/'}
    ],
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: connect(mapStateToProps, mapDispatchToProps)(Hazard)
  }
]


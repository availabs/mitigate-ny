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
            </div>

            <div className="property-section">
              <Content content_id={`${hazard}-historic`} />
              <HazardScoreTable />
            </div>
            
            <div className="property-section">
              <Content content_id={`${hazard}-previous_occurrences`} />
            </div>

            <div className="property-section">
              <Content content_id={`${hazard}-presidential`} />
            </div>
            
            <div className="property-section">
              <Content content_id={`${hazard}-probability`} />
            </div>
            
            <div className="property-section">
              <Content content_id={`${hazard}-local_vulnerability`} />
            </div>

            <div className="property-section">
              <Content content_id={`${hazard}-state_capability`} />
            </div>
            
            <div className="property-section">
              <Content content_id={`${hazard}-climate_change`} />
            </div>

            <div className="property-section">
              <Content content_id={`${hazard}-repetitive`} />
            </div>

            <div className="property-section">
              <Content content_id={`${hazard}-related_terms`} />
            </div>

            <div className="property-section">
              <Content content_id={`${hazard}-related_narrative`} />
            </div>

            <div className="property-section">
              <Content content_id={`${hazard}-bibliography`} />
            </div>
           
          </div>
          <div className='property-info-side' style={{maxWidth: 398}}>
            <div className='side-section-content'>

              <HazardList display={'full'} size={12} dataType={'severeWeather'}/>

              <HazardEventsMapController
                hazard={ hazard }
                mapLegendLocation="top-center"
                mapLegendSize="small"
                mapControlsLocation="bottom-left"
                mapHeight={ 600 }/>

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
    breadcrumbs: [
      {name: 'Hazard', path: '/hazards'},
      {param: 'hazard', path: '/hazards/'}
    ],
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: connect(mapStateToProps, mapDispatchToProps)(Hazard)
  }
]


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createMatchSelector } from 'react-router-redux'
import { reduxFalcor } from 'utils/redux-falcor'

import ProjectBox from 'components/light-admin/containers/ProjectBox'

import Content from 'components/cms/Content'
import HazardList from './components/HazardList'
import HazardScoreTable from './components/HazardScoreTable'
import HazardMap from "./components/HazardMap"
import HazardStats from './components/HazardStats'

import HazardEventsMapController from "./components/HazardEventsMapController"
import SbaChoropleth from "./components/SbaChoropleth"
import FemaDisasterDeclarationsTable from "./components/FemaDisasterDeclarationsTable"
import HazardEventsTable from "./components/HazardEventsTable"

class Hazard extends Component {

  fetchFalcorDeps() {
    let geoid = this.props.geoid || '36'
    let dataType = this.props.dataType || 'sheldus'
    return this.props.falcor.get(
      ['riskIndex', 'hazards']
    ).then(data => {
      return this.props.falcor.get(
        ['riskIndex','meta', data.json.riskIndex.hazards, ['id', 'name']]
      )
    })
  }

  render () {
    const { params } = createMatchSelector({ path: '/hazards/:hazard' })(this.props) || {};
    let hazard = params && params.hazard ? params.hazard : null
    
    if(!hazard) return null

    let hazardName = this.props.riskIndex.meta &&  this.props.riskIndex.meta[hazard] ? this.props.riskIndex.meta[hazard].name : ''
    return (
      <div className='property-single'>
        {/*
           Section 1 - Intro, Overview & Stats
        */}
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '60%'}}>
            
            <h1>{hazardName}</h1>

            <div className="property-section">
              <Content content_id={`${hazard}-setting_context`} />
            </div>

            <div className="property-section">
              <Content content_id={`${hazard}-vulnerability`} />
            </div>
            
            <div className="property-section">
              <Content content_id={`${hazard}-magnitude`} />
            </div>
            
            <div className="property-section">
              <Content content_id={`${hazard}-characteristics`} />
            </div>
          </div>

          <div className='property-info-side' style={{maxWidth: 398}}>
            <div className='side-section-content' style={{paddingTop: 60 }}>
              <HazardStats 
                hazard={hazard} 
                dataType={'severeWeather'}
              />
            <div className='projects-list row'>
              <ProjectBox title={`definition`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`${hazard}-definition`} />
              </ProjectBox>  
            </div>
            
            </div>
          </div>
        </div>

        {/*
           Section 2 - Location & Historic Events
        */}
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '60%'}}>
            <div className="property-section">
              <div className="property-section">
                  <h5>FEMA Risk Index Score for {hazardName}</h5>
                  
                <Content content_id={`${hazard}-location`} />
              </div>
            </div>
          </div>
          <div className='property-info-side' style={{maxWidth: 398}}>
            <div className='side-section-content' style={{paddingTop: 60 }}>
             
              <div className='projects-list row'>
                <ProjectBox title={`High Risk Municipalities`} style={{backgroundColor: '#f2f4f8', width:'100%', height: 300}}>
                
                </ProjectBox>  
              </div>
          
            </div>
          </div>
        </div>
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '100%'}}>
            <div className="property-section">
              <div className="property-section">
                <h5>Statewide Map of SBA Disaster Loans for {hazardName}</h5>
                2001-2017<br/>
                <SbaChoropleth
                  hazard={ hazard }
                  height={ 600 }
                />
                <br />
                <br />
              </div>

              <div className="property-section">
                <Content content_id={`${hazard}-historic`} />
                <h5>Statewide Map of {hazardName} Events </h5>
                  <HazardEventsMapController
                    allTime={ true }
                    showLegend={ false }
                    hazard={ hazard }
                    height={ 600 }
                  />
                <HazardScoreTable 
                  hazard={hazard}
                />
              </div>
            
           
            </div>
          </div>
        </div>
        <div className='row'>
          <div className= 'col-12'>
             <HazardEventsMapController
                  showLegend={ false }
                  hazard={ hazard }
                  numMaps={ 12 }
                />
          </div>
        </div>
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '100%'}}>
           
             <div className="property-section">
              <Content content_id={`${hazard}-previous_occurrences`} />
              <HazardEventsTable hazard={hazard} />
            </div>
          </div>
        </div>

        {/*
           Section 3 - Probability
        */}
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '60%'}}>
            <div className="property-section">
              <Content content_id={`${hazard}-probability`} />
            </div>
          </div>
          <div className='property-info-side' style={{maxWidth: 398}}>
            <div className='side-section-content'>
                <HazardList
                hazard={hazard}
                dataType='severeWeather'
                display='full'
              />
            </div>
          </div>
        </div>
        {/*
           Section 3 - Vulnerability
        */}
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '100%'}}>
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
        </div>
 
    </div>
    )
  }
}

const mapDispatchToProps = { };

const mapStateToProps = state => {
  return {
    riskIndex: state.graph.riskIndex || {},
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
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Hazard))
  }
]


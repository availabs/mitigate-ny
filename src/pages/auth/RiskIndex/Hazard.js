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
import CriticalInfrastructureTable from './components/CriticalInfrastructureTable'
import CapabilitiesTable from './components/CapabilitiesTable'
import HMGPTable from './components/HMGPTable'

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

  presidential (hazard) {
    if(['wildfire' , 'heatwave' , 'tsunami' , 'volcano'].includes(hazard)) {
      return ''
    } else {
      return (
        <div>
          <h4>Presidential Disaster Declarations</h4>
          <FemaDisasterDeclarationsTable hazard={hazard} />
        </div>
      )
    }
  }

  statewideEvents (hazard,hazardName) {
    if(['heatwave' , 'volcano' , 'avalanche' , 'drought' , 'earthquake' , 'tsunami'].includes(hazard)) {
      return ''
    } else {
      return (

        
        <div className="property-section">
            <div className="property-section">
              <Content content_id={`${hazard}-all_statewide_events`} />
            </div>
              <div className="property-section">
                  <h5>Statewide Map of {hazardName} Events </h5>
                  <strong>1996-2017</strong>
                  <HazardEventsMapController
                    allTime={ true }
                    showLegend={ false }
                    hazard={ hazard }
                    height={ 600 }
                  />
               </div>           
        </div>
      )
    }
  }

  HeroStats (hazard) {
    if(['volcano'].includes(hazard)) {
      return ''
    } else {
      return (
       <HazardStats 
          hazard={hazard} 
          dataType={'severeWeather'}
        />
      )
    }
  }

  historicMaps (hazard, hazardName) {
    if(['wildfire' , 'heatwave' , 'volcano' , 'avalanche' , 'drought' , 'earthquake' , 'landslide' , 'coldwave' , 'tsunami' , 'hail' , 'icestorm' , 'winterweat'].includes(hazard)) {
      return ''
    } else {
      console.log('historicMaps', ['wildfire'].includes(hazard), hazard)
      return (
        
        <div className='row'>
        <div className="property-section">
              <Content content_id={`${hazard}-historical_occurances`} />
        </div>

          <div className= 'col-12'>
            <h5>Historic {hazardName} Events</h5>
            <HazardEventsMapController
              showLegend={ false }
              hazard={ hazard }
              numMaps={ 12 }
            />
          </div>
        </div>
      )
    }
  }

  eventsLossTable (hazard) {
    if(['wildfire' , 'avalanche' , 'tsunami' , 'volcano' , 'earthquake'].includes(hazard)) {
      return ''
    } else {
      return (
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '100%', paddingTop:0}}>
           
            <div className="property-section">
              <Content content_id={`${hazard}-highest_reported_loss`} />
            </div>
             
             <div className="property-section">
               <h4>Events with Highest Reported Loss in Dollars</h4>
               <strong>1996-2017</strong>
               <HazardEventsTable hazard={hazard} />
               <i style={{color: '#afafaf'}}>Source: NCDC Storm Events Dataset</i>
            </div>
          </div>
        </div>
      )
    }
  }

probability (hazard) {
    if(['volcano'].includes(hazard)) {
      return ''
    } else {
      return (
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '60%', paddingTop: 0}}>
            <div className="property-section">
              <Content content_id={`${hazard}-probability`} />
            </div>
          </div>
          <div className='property-info-side' style={{maxWidth: 398,  paddingTop: 0}}>
            <div className='side-section-content'>
                <HazardList
                hazard={hazard}
                dataType='severeWeather'
                display='full'
              />
            </div>
          </div>
        </div>  
      )
    }
  }

municipalityTable (hazard) {
    if(['volcano'].includes(hazard)) {
      return ''
    } else {
      return (
          <div className='property-info-side' style={{maxWidth: 398}}>
            <div className='side-section-content' style={{paddingTop: 0 }}>
              
              <div className='projects-list row'>
                <ProjectBox title={`High Risk Municipalities`} style={{backgroundColor: '#f2f4f8', width:'100%', height: 300}}>
                
                </ProjectBox>  
              </div>
          
            </div>
          </div>
      )
    }
  }



criticalInfrastructure (hazard) {
    if(['volcano' , 'avalanche' , 'tsunami' ].includes(hazard)) {
      return ''
    } else {
      return (
        <div className="property-section">
              <h5>Critical Infrastructure & State Assets in High Risk Census Tract</h5>
              <HazardMap 
                  height={ 600 }
                  hazard={hazard}
                  threeD={false}
                  highRisk={0.95}
                  geoid='36'
                />
                <CriticalInfrastructureTable  />
            </div>
      )
    }
  }

  repetitive (hazard) {
    if (hazard === 'riverine') {
      return <Content content_id={`${hazard}-repetitive_loss`} />
    }
    return
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
          <div className="property-info-main" style={{paddingBottom: 0}}>
            <h1>{hazardName}</h1>

            
          </div>
        </div>

        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '60%', paddingBottom: 0, paddingTop: 0}}>
            

            <div className="property-section">
              <Content content_id={`${hazard}-setting_context`} />
            </div>

          <div className="property-section">
              <Content content_id={`${hazard}-characteristics`} />
           </div>

            <div className="property-section">
              <Content content_id={`${hazard}-magnitude`} />
           </div>
           
          </div>
          <div className='property-info-side' style={{maxWidth: 398}}>
            <div className='side-section-content' style={{paddingTop: 0 }}>
              <div className='projects-list row'>
              <ProjectBox title={`definition`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`${hazard}-definition`} />
              </ProjectBox>  
            </div>
                {this.HeroStats(hazard)}
              
            
            
            </div>
          </div>
        </div>

        {/*
           Section 2 - Location & Historic Events
        */}
        
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '100%'}}>
            
            
            {this.statewideEvents(hazard,hazardName)}


            
          </div>
        </div>
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '60%', paddingBottom: 0, paddingTop: 0}}>
            <div className="property-section">
              <div className="property-section">

                <Content content_id={`${hazard}-location`} />

              </div>
            </div>
          </div>
          {this.municipalityTable(hazard)}
        </div>
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '100%', paddingBottom: 0}}>
              
              <div className="property-section" >
                  <Content content_id={`${hazard}-basemap`} />
              </div>

            <div className="property-section">
              <Content content_id={`${hazard}-all_reported_loss`} />
            </div>

              <div className="property-section">
                <h5> {hazardName} - Reported Loss in Dollars by County </h5>
                <strong>1996-2017</strong>
              
                <HazardScoreTable 
                  hazard={hazard}
                />

                {this.repetitive(hazard)}
                  
                {this.presidential(hazard)}
                <Content content_id={`${hazard}-historic`} />
                  

              </div>
          </div>
        </div>
        {this.historicMaps(hazard, hazardName)}
        {this.eventsLossTable(hazard)}


        {/*
           Section 3 - Probability
        */}
          {this.probability(hazard)}
        {/*
           Section 3 - Vulnerability
        */}
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '100%'}}>
            
            {this.criticalInfrastructure (hazard)}

            
            <div className="property-section">
              <Content content_id={`${hazard}-hmgp`} />
            </div>
            <div className="property-section">
              <Content content_id={`${hazard}-state_capability`} />
              <CapabilitiesTable hazard={hazard} />
              <HMGPTable hazard={hazard} />
            </div>
            { /*
            <div className="property-section">
              <Content content_id={`${hazard}-related_narrative`} />
            </div>
             */ }


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


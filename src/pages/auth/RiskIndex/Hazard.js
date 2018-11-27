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
import HighRiskMunicipalities from "./components/HighRiskMunicipalities"

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

  getHazardMap(hazard) {
    if(['riverine'].includes(hazard)) {
      return (
        <HazardMap  
          height={ 600 }
          hazard={ hazard }
          standardScale={ false }
          threeD={ false }
          highRisk={0.0}
          tractTotals={ true }
          geoid='36'
          thresholds={ [10000, 100000, 500000, 1000000] }
        />
      )
    } else {
      return (
        <HazardMap  
          height={ 600 }
          hazard={ hazard }
          standardScale={ false }
          threeD={ false }
          highRisk={0.0}
          tractTotals={ true }
          geoid='36'
          thresholds={ [5000, 50000, 100000, 500000] }
        />
    )
   }   
  }

  presidential (hazard) {
    if(['wildfire' , 'heatwave' , 'tsunami' , 'volcano', 'lightning'].includes(hazard)) {
      return ''
    } else {
      return (
        <div>
          <h5>Presidential Disaster Declarations</h5>
          <Content content_id={'hazards-presidential-disaster-declarations'} />
          <FemaDisasterDeclarationsTable hazard={hazard} />
          <i style={{color: '#afafaf'}}>Source: <a href="https://www.fema.gov/disasters" target="_blank">FEMA Disaster Declarations</a></i>
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
                  <h5>Statewide Map of {hazardName} Events </h5>
                  <strong>1996-2017</strong>
                  <div>
                    Below is a map of individual {hazardName} events in New York State from 1996-2017 with damages above $50k, sized by total loss.
                    <br />
                  </div>
                 
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
       <div>
         <HazardStats 
            hazard={hazard} 
            dataType={'severeWeather'}
          />
          <div>
            <i style={{color: '#afafaf'}}>Source: <a href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI Storm Events Dataset</a></i>
          </div>
        </div>
      )
    }
  }

   CRS (hazard) {
    if(['riverine'].includes(hazard)) {
      return (
        
        <div className='property-info-side' style={{maxWidth: 398}}>
            <div className='side-section-content' style={{paddingTop: 0 }}>
              <div className='projects-list row'>
                <ProjectBox title={`Flooding Case Study`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                  <Content content_id={`${hazard}-flooding_story`} />
                </ProjectBox>
              </div>
            </div>
        </div>     
       )
    } else {
      return ''
    }
  }


  historicMaps (hazard, hazardName) {
    if(['wildfire' , 'coastal' , 'heatwave' , 'volcano' , 'avalanche' , 'drought' , 'earthquake' , 'landslide' , 'coldwave' , 'tsunami' , 'hail' , 'icestorm' , 'winterweat'].includes(hazard)) {
      return ''
    } else {
      // console.log('historicMaps', ['wildfire'].includes(hazard), hazard)
      return (
        
        <div className='row'>
        {
          /*<div className="property-section">
                <Content content_id={`${hazard}-historical_occurances`} />
          </div>*/
        }

          <div className= 'col-12'>
           <h5>{hazardName} Events by Year</h5>
           <div>
            Click on the arrows next to the year above any map to view and compare historical years. <br />
            </div>
            <HazardEventsMapController
              showLegend={ false }
              hazard={ hazard }
              numMaps={ 3 }
            />
          </div>
        </div>
      )
    }
  }

  eventsLossTable (hazard, hazardName) {
    if(['wildfire' , 'avalanche' , 'tsunami' , 'volcano' , '' , 'earthquake'].includes(hazard)) {
      return ''
    } else {
      return (
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '100%', paddingTop:0}}>
             
             <div className="property-section">
               <h5>Events with Highest Reported Loss in Dollars</h5>
               <strong>1996-2017</strong>
               <div>The table below summarizes the top 50 {hazardName} events by loss in dollars. Click on a row to view the event description.</div>
               <HazardEventsTable hazard={hazard} />
               <i style={{color: '#afafaf'}}>Source: <a href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI Storm Events Dataset</a></i>
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
          <div className="property-info-main" style={{maxWidth: '60%', paddingTop: 0, paddingBottom: 0}}>
            <div className="property-section">
              <Content content_id={`${hazard}-probability`} />
            </div>
          </div>
          <div className='property-info-side' style={{maxWidth: 398,  paddingTop: 0, paddingBottom: 0, marginBottom: 0}}>
            <div className='side-section-content'>
                <HazardList
                hazard={hazard}
                dataType='severeWeather'
                display='full'
              />
              <i style={{color: '#afafaf', paddingBottom: 0}}>Source: <a href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI Storm Events Dataset</a></i>
            </div>
          </div>
        </div>
      )
    }
  }

probabilityMap (hazard) {
    if(['volcano'].includes(hazard)) {
      return ''
    } else {
      return (      
        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingTop: 0, paddingBottom: 0}}>
            <div className="property-section">
              <Content content_id={`${hazard}-basemap`} />
            </div>
          </div>
        </div>
      )
    }
  }


municipalityTable (hazard) {
    if(['volcano' , 'avalanche' , 'coastal' , 'coldwave' , 'drought' , 'earthquake' , 'heatwave' , 'icestorm' , 'landslide' , 'winterweat' , 'tsunami' , 'wildfire'].includes(hazard)) {
      return (
      <div className='property-info-side' style={{maxWidth: 398}}>
            <div className='side-section-content' style={{paddingTop: 0, paddingBottom:0 }}>
              
              <div className='projects-list row'>

                <ProjectBox title={`High Risk Counties`} style={{backgroundColor: '#f2f4f8', width:'100%', paddingBottom: 0 }}>
                  <HighRiskMunicipalities hazard={hazard}
                  geoLevel="counties"  />
                </ProjectBox> 
                
              </div>
              
            </div>
            <i style={{color: '#afafaf'}}>Source: <a href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI Storm Events Dataset</a>
              </i>
        </div>
      )
    } 
    else {
      return (
          <div className='property-info-side' style={{maxWidth: 398}}>
            <div className='side-section-content' style={{paddingTop: 0, paddingBottom:0 }}>
              
              <div className='projects-list row'>

                <ProjectBox title={`High Risk Municipalities`} style={{backgroundColor: '#f2f4f8', width:'100%', paddingBottom: 0 }}>
                  <HighRiskMunicipalities hazard={hazard}  />
                </ProjectBox> 
                
              </div>
              
            </div>
            <i style={{color: '#afafaf'}}>Source: <a href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI Storm Events Dataset</a>
              </i>

            <div className='side-section-content' style={{paddingTop: 0, paddingBottom:0 }}>
              
              <div className='projects-list row'>

                <ProjectBox title={`High Risk Counties`} style={{backgroundColor: '#f2f4f8', width:'100%', paddingBottom: 0 }}>
                  <HighRiskMunicipalities hazard={hazard}
                  geoLevel="counties"  />
                </ProjectBox> 
                
              </div>
              
            </div>
            <i style={{color: '#afafaf'}}>Source: <a href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI Storm Events Dataset</a>
              </i>
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
                <CriticalInfrastructureTable  hazard={hazard} />
                <Content content_id={`${hazard}-critical_infrastructure`}/>
            </div>
      )
    }
  }

  criticalInfrastructureMap (hazard) {
    if (hazard === 'riverine' || hazard === 'earthquake') {
      return <Content content_id={`${hazard}-critical_infrastructure_map`} />
    }
    return
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
                {this.CRS(hazard)}
            </div>
          </div>
        </div>




        {/*
           Section 2 - Location & Historic Events
        */}
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
            <div className="property-info-main" style={{maxWidth: '100%'}}>

              <h5>Damage in Dollars from {hazardName} Events, By Census Tract, 1996-2017</h5>
              
                { this.getHazardMap(hazard) }

                <i style={{color: '#afafaf'}}>Source: <a href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI Storm Events Dataset</a>
                </i>
              </div>
          </div>
       
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '100%', paddingBottom: 0 , paddingTop: 0}}>
              <div className="property-section">
                <h5> {hazardName} - Reported Loss in Dollars by County </h5>
                <strong>1996-2017</strong>
                <div>The table below summarizes the loss amount due to Flooding in dollars for each county. Severe events are considered those which caused more than $1M in damage.</div>
                
                <HazardScoreTable 
                  hazard={hazard}
                />
                <i style={{color: '#afafaf'}}>
                  Source: <a href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI Storm Events Dataset</a>
                </i>
                {this.repetitive(hazard)}
                
                <Content content_id={`${hazard}-historic`} />
                {this.presidential(hazard)}

              </div>
          </div>
        </div>
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '100%'}}>
            {this.statewideEvents(hazard,hazardName)}
              
              {hazardName} events by year. Use the date controls to compare any three historical years.<br/>
              <i style={{color: '#afafaf'}}>
                Source: <a href="https://www.ncdc.noaa.gov/stormevents/" target="_blank"> NOAA NCEI Storm Events Dataset</a>
              </i>
          </div>
        </div>
        {this.historicMaps(hazard, hazardName)}
        {this.eventsLossTable(hazard)}


        {/*
           Section 3 - Probability
        */}
          {this.probability(hazard)}
          {this.probabilityMap (hazard)}
        {/*
           Section 3 - Vulnerability
        */}
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '100%', paddingBottom: 0}}>
            <div className="property-section">
              <Content content_id={'hazard-vulnerability-introduction'} />
            </div>
             {/* {this.criticalInfrastructure (hazard)}
             */}
             {this.criticalInfrastructureMap (hazard)}
            
            <div className="property-section">
              <Content content_id={`${hazard}-hmgp`} /> 
            </div>
            <div className="property-section">
              <Content content_id={`hazards-state-capability`} />
              <CapabilitiesTable 
              hazard={hazard}
              title= {hazardName + " Mitigation Capabilities"} 
              type="program"
              columns={ ["name" , "agency" , 'contact_department' , "description" , 'admin' , 'url' ] }
              filterColumns={ ["goal" , 'agency' , 'admin'] }
              expandColumns={ ["description"] }
              urlColumn="url"
              />
              <CapabilitiesTable 
              hazard={hazard}
              title= {hazardName + " Mitigation Actions"} 
              type="action"
              columns={ ["name" , "agency" , "description" , "budget_provided" , 'goal'] }
              filterColumns={ ["goal" , 'agency'] }
              expandColumns={ ["description"] }
              />
              <div className="property-section">
                <Content content_id={'hazards-hmgp-overview'} />
              </div>
                <HMGPTable hazard={hazard} />
                <i style={{color: '#afafaf'}}>Source: <a href="https://www.fema.gov/openfema-dataset-hazard-mitigation-assistance-projects-v1" target="_blank">FEMA Hazard Mitigation Assistance Projects - V1</a></i>
              </div>
              <CapabilitiesTable 
              hazard={hazard} 
              title= {hazardName + " Mitigation Measures"} 
              type="measure"
              columns={ ["name" ,  "description" , 'goal'] }
              filterColumns={ ["goal"] }

              />
            </div>
          </div>
            { /*
            <div className="property-section">
              <Content content_id={`${hazard}-related_narrative`} />
            </div>
             */ }

        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingTop: 0, paddingBottom: 0}}>
            <div className="property-section">
              <Content content_id={`${hazard}-methodology`} />
            </div>
          </div>
        </div>    
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '100%'}}>
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


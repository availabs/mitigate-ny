import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createMatchSelector } from 'react-router-redux'
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import Content from 'components/cms/Content'
import HazardList from './components/HazardList'
import HazardScoreTable from './components/HazardScoreTable'
import HazardMap from './components/HazardMap'
import HazardStats from './components/HazardStats'

import HazardEventsMapController from "./components/HazardEventsMapController"
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

    return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">
            
            <h1>{this.props.riskIndex.meta &&  this.props.riskIndex.meta[hazard] ? this.props.riskIndex.meta[hazard].name : ''}</h1>

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
              <Content content_id={`${hazard}-location`} />
            </div>

            <div className="property-section">
              <Content content_id={`${hazard}-historic`} />
              <HazardScoreTable />
            </div>
            
            <div className="property-section">
              <Content content_id={`${hazard}-previous_occurrences`} />
            </div>
          </div>

          <div className='property-info-side' style={{maxWidth: 398}}>
            <div className='side-section-content' style={{paddingTop: 60 }}>
              <HazardStats 
                hazard={hazard} 
                dataType={'severeWeather'}
              />
              <div className="property-section" style={{padding: 25}}>
                <Content content_id={`${hazard}-definition`} />
              </div>
            
              <div className="property-section"  style={{padding: 25}}>
                <Content content_id={`${hazard}-characteristics`} />
              </div>


            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-lg-12'>
            <HazardEventsMapController
              showLegend={ false }
              hazard={ hazard }
              />
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-12'>
            <HazardEventsTable hazard={hazard} />
          </div>
        </div>

        <div className='property-info-w'>
          <div className="property-info-main">
            <div className="property-section">
                <Content content_id={`${hazard}-presidential`} />
                <FemaDisasterDeclarationsTable
                 hazard={ hazard }
                />
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
                test 123
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


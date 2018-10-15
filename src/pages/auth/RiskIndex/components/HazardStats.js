import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'
import get from 'lodash.get'

import * as d3format from "d3-format"

import { total, avg, fnum } from 'utils/sheldusUtils'

import ProjectBox from 'components/light-admin/containers/ProjectBox'

import {
  EARLIEST_YEAR,
  LATEST_YEAR
} from "./yearsOfSevereWeatherData";

const percentFormat = d3format.format(".2%")

class HazardList extends Component {
  state = {
    loading: true
  }

  fetchFalcorDeps() {
    let geoid = this.props.geoid || '36'
    let dataType = this.props.dataType || 'severeWeather'
    let hazard = this.props.hazard || 'riverine'
    
    return this.props.falcor.get(
      ['riskIndex','meta', hazard, ['id', 'name']],
      [dataType, geoid, hazard, 'allTime', ['daily_severe_event_prob', 'annualized_num_severe_events', 'daily_event_prob','annualized_damage', 'annualized_num_events', 'injuries', 'fatalities']]
    )
    // .then(data => {
    //   console.log('all data back', Object.keys(data.json[dataType][geoid][hazard]), data.json[dataType][geoid][hazard])
    //   return data
    // })
  }

  render () {
    let geoid = this.props.geoid || '36'
    let dataType = this.props.dataType || 'severeWeather'
    let hazard = this.props.hazard || 'riverine'
    
    let hazardName = this.props.riskIndex.meta ? this.props.riskIndex.meta[hazard].name : ''
    if ( !get(this.props,`${dataType}.${geoid}.${hazard}`, true) ) return <span />

    let hazardData =   get(this.props,`${dataType}[${geoid}][${hazard}].allTime`, {})
    return (
      <div className='projects-list row'>
      <ProjectBox title={`Statewide Statistics`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
        <div className="row align-items-center">
          <div className="col-sm-12">
          
            <div className="row">   
              <div className="col-12" style={{textAlign:'center', paddingBottom: 30}}>
                  <div className="el-tablo highlight">
                    <div className="value">{ fnum(hazardData['annualized_damage']) }</div>
                    <div className="label">Annualized Loss from {hazardName}<br />({EARLIEST_YEAR}- {LATEST_YEAR})</div>
                  </div>
              </div>
            </div>

            <div className="row">   
              <div className="col-12" style={{textAlign:'center', paddingBottom: 30}}>
                  <div className="el-tablo highlight">
                    <div className="value">{ hazardData['annualized_num_events'] }</div>
                    <div className="label">Annualized # of { hazardName } Episodes
                    <br />({EARLIEST_YEAR}- {LATEST_YEAR})</div>
                  </div>
              </div>
            </div>

            <div className="row">   
              <div className="col-12" style={{textAlign:'center', paddingBottom: 30}}>
                  <div className="el-tablo highlight">
                    <div className="value">{ percentFormat(hazardData['daily_event_prob']) }</div>
                    <div className="label">  Daily Probability of {hazardName} Episode</div>
                  </div>
              </div>
            </div>


            <div className="row">   
              <div className="col-12" style={{textAlign:'center', paddingBottom: 30}}>
                  <div className="el-tablo highlight">
                    <div className="value">{ hazardData['annualized_num_severe_events'] }</div>
                    <div className="label">Annualized # of Severe {hazardName} Episodes<br />({EARLIEST_YEAR}- {LATEST_YEAR})</div>
                  </div>
              </div>
            </div>

            <div className="row">   
              <div className="col-12" style={{textAlign:'center', paddingBottom: 30}}>
                  <div className="el-tablo highlight">
                    <div className="value">{ percentFormat(hazardData['daily_severe_event_prob']) }</div>
                    <div className="label">Daily Propbability of Severe {hazardName} Episode</div>
                  </div>
              </div>
            </div>

            <div className="row">   
              <div className="col-12" style={{textAlign:'center', paddingBottom: 30}}>
                  <div className="el-tablo highlight">
                    <div className="value">{ hazardData['injuries'] }</div>
                    <div className="label">Total {hazardName} Injuries
                    <br />({EARLIEST_YEAR}- {LATEST_YEAR})</div>
                  </div>
              </div>
            </div>

            <div className="row">   
              <div className="col-12" style={{textAlign:'center', paddingBottom: 30}}>
                  <div className="el-tablo highlight">
                    <div className="value">{ hazardData['fatalities'] }</div>
                    <div className="label">Total {hazardName} Fatalities
                    <br />({EARLIEST_YEAR}- {LATEST_YEAR})</div>
                  </div>
              </div>
            </div>
            
          </div>
        </div>
      </ProjectBox>
      </div>
    ) 
  }
}

const mapDispatchToProps = { };

const mapStateToProps = state => {
  // console.log('mapping', state)
  return {
    riskIndex: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeWeather: state.graph.severeWeather || {},
    router: state.router
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardList))
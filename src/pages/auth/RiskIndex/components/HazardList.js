import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'
import get from 'lodash.get'

import { processSheldus5year, sumData, avgData } from 'utils/sheldusUtils'

import { createMatchSelector } from 'react-router-redux'

import ElementBox from 'components/light-admin/containers/ElementBox'
import HazardOverview from './HazardOverview'



class HazardList extends Component {
  state = {
    loading: true
  }

  fetchFalcorDeps() {
    let geoid = this.props.geoid || '36'
    let dataType = this.props.dataType || 'sheldus'
    return this.props.falcor.get(
      ['riskIndex', 'hazards']
    ).then(data => {
      return this.props.falcor.get(
        ['riskIndex','meta', data.json.riskIndex.hazards, ['id', 'name']],
        ['riskIndex', geoid, data.json.riskIndex.hazards, ['score','value']],
        [dataType, geoid, data.json.riskIndex.hazards,{from: 1990, to: 2017}, ['num_events','property_damage', 'crop_damage', 'injuries', 'fatalities']]
      )
    }).then(data => {
      console.log('all data back', data)
      return data
    })
  }

  render () {
    let geoid = this.props.geoid || '36'
    let dataType = this.props.dataType || 'sheldus'
    const { params } = createMatchSelector({ path: '/risk-index/h/:hazard' })(this.props) || {}
    // console.log(this.props.riskIndex)
    if (!this.props.riskIndex.meta
        || !this.props.riskIndex.hazards
        || !this.props.riskIndex[geoid]) {
      return (
         <ElementBox> Loading... </ElementBox>
      )
    }
    const hazard = params && params.hazard ? params.hazard : false
    // console.log('render data', this.props.riskIndex)
    let hazards =this.props.riskIndex.hazards.value
      // .filter(d => this.props.riskIndex[geoid][d].value || this.props.riskIndex[geoid][d].score)
      .filter(d => !hazard || hazard === d)
      // .filter(d => d === 'wind') // debugging
      .sort((a,b) =>  avgData(this.props[dataType][geoid][b],'property_damage',5)[2017] - avgData(this.props[dataType][geoid][a],'property_damage',5)[2017] )
      .map((hazard,i) => {
        // console.log(
        //     this.props.riskIndex.meta[hazard].name,
        //     this.props.riskIndex[geoid]
        // )
        let sheldus = this.props[dataType][geoid][hazard]
        // console.log('sheldus', sheldus)
        return (
          <HazardOverview 
            key={i} 
            title={this.props.riskIndex.meta[hazard].name} 
            value={this.props.riskIndex[geoid][hazard].value || 'N/A'}
            score={this.props.riskIndex[geoid][hazard].score || 'N/A'}
            sheldus={sheldus}
            display={this.props.display}
            size={this.props.size || 12}
            link={`/risk-index/h/${hazard}`} 
          />
        )
      })

    
    return (
      <div className='projects-list row'>
        {hazards}
      </div>
    ) 
  }
}

const mapDispatchToProps = { };

const mapStateToProps = state => {
  console.log('mapping', state)
  return {
    riskIndex: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeWeather: state.graph.severeWeather || {},
    router: state.router
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardList))
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'
import get from 'lodash.get'

import { processSheldus5year, sumData, avgData } from 'utils/sheldusUtils'

import { createMatchSelector } from 'react-router-redux'

import ElementBox from 'components/light-admin/containers/ElementBox'
import HazardOverview from './HazardOverview'

import {
  EARLIEST_YEAR,
  LATEST_YEAR
} from "./yearsOfSevereWeatherData";

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
        [dataType, geoid, data.json.riskIndex.hazards, {from: EARLIEST_YEAR, to: LATEST_YEAR}, ['num_events','property_damage', 'crop_damage', 'injuries', 'fatalities']]
      )
    })
  }

  render () {
    let geoid = this.props.geoid || '36'
    let dataType = this.props.dataType || 'sheldus'
    if (!this.props.riskIndex.meta
        || !this.props.riskIndex.hazards
        || !this.props.riskIndex[geoid]
        || !this.props[dataType]
        || !this.props[dataType][geoid]) {
      return (
         <ElementBox> Loading... </ElementBox>
      )
    }
    const hazard = this.props.hazard ? this.props.hazard : false
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
            hazard={ hazard }
            key={i}
            title={this.props.riskIndex.meta[hazard].name + ' Occurences By Year'}
            value={this.props.riskIndex[geoid][hazard].value || 'N/A'}
            score={this.props.riskIndex[geoid][hazard].score || 'N/A'}
            sheldus={sheldus}
            display={this.props.display}
            size={this.props.size}
            link={`/hazards/${hazard}`}
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

HazardList.defaultProps = {
  geoid: 36,
  size: 12
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

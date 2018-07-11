import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'
import get from 'lodash.get'

import { createMatchSelector } from 'react-router-redux'
import { getHazardTotal } from 'store/modules/riskIndex'

import ElementBox from 'components/light-admin/containers/ElementBox'
import HazardOverview from './HazardOverview'



class HazardList extends Component {
  state = {
    loading: true
  }

  fetchFalcorDeps() {
    let geoid = this.props.geoid || '36'
    return this.props.falcor.get(
      ['riskIndex', 'hazards']
    ).then(data => {
      return this.props.falcor.get(
        ['riskIndex','meta', data.json.riskIndex.hazards, ['id', 'name']],
        ['riskIndex', geoid, data.json.riskIndex.hazards, ['score','value']],
        ['sheldus', geoid, data.json.riskIndex.hazards,{from: 1961, to: 2017}, ['num_events','property_damage', 'crop_damage', 'injuries', 'fatalities']]
      )
    }).then(data => {
      console.log('all data back', data)
      return data
    })
  }

  componentWillMount() {
    let geoid = this.props.geoid || '36'
    if (!this.props.riskIndex[geoid]) {
      this.props.getHazardTotal(geoid)
    } 
  }

  render () {
    let geoid = this.props.geoid || '36'
    const { params } = createMatchSelector({ path: '/risk-index/h/:hazard' })(this.props) || {}
    console.log(this.props.riskIndex)
    if (!this.props.riskIndex.meta) {
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
      .sort((a,b) =>  this.props.riskIndex[geoid][b].score - this.props.riskIndex[geoid][a].score)
      .map((hazard,i) => {
        // console.log(
        //     this.props.riskIndex.meta[hazard].name,
        //     this.props.riskIndex[geoid]
        // )
        let sheldus = this.props.sheldus[geoid][hazard]
        //console.log('sheldus', sheldus)
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

const mapDispatchToProps = { getHazardTotal };

const mapStateToProps = state => {
  console.log('mapping', state)
  return {
    riskIndex: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    router: state.router
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardList))
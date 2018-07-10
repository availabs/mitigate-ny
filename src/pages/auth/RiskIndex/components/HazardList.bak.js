import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'redux-falcor'
import get from 'lodash.get'

import { createMatchSelector } from 'react-router-redux'
import { getHazardTotal } from 'store/modules/riskIndex'  

import ElementBox from 'components/light-admin/containers/ElementBox'
import HazardOverview from './HazardOverview'


class HazardList extends Component {
  fetchFalcorDeps() {
    let geoid = this.props.geoid || '36'
    return this.props.falcor.get(
      ['riskIndex', 'hazards']
    ).then(data => {
      return this.props.falcor.get(
        ['riskIndex','meta', data.json.riskIndex.hazards, ['id', 'name']],
        ['riskIndex',geoid,data.json.riskIndex.hazards, ['score','value']]
      )
    })
    .then(data => {
      console.log('data', get(data, 'data.json.riskIndex.36.wind.score', 'nope'))
      return data
    })
  }

  componentWillMount() {
    let geoid = this.props.geoid || '36'
    if (!this.props.riskIndex[geoid]) {
      this.props.getHazardTotal(geoid)
    } 
  }

  renderData () {
    let hazardList = get(this.props, 'graph.riskIndex.hazards.value', null)
  } 

  render () {
    let geoid = this.props.geoid || '36'
    const { params } = createMatchSelector({ path: '/risk-index/h/:hazard' })(this.props) || {}
    if (!this.props.riskIndex[geoid]) {
      return (
         <ElementBox> Loading... </ElementBox>
      )
    }
    const hazard = params && params.hazard ? params.hazard : false
    let hazards = Object.keys(this.props.riskIndex.meta)
      .filter(d => !isNaN(this.props.riskIndex[geoid][d]) || !isNaN(this.props.riskIndex[geoid][`${d}_SCORE`]))
      .filter(d => !hazard || hazard === d)
      .sort((a,b) =>  this.props.riskIndex[geoid][`${b}_SCORE`] - this.props.riskIndex[geoid][`${a}_SCORE`])
      .map((hazard,i) => (
        <HazardOverview 
          key={i} 
          title={this.props.riskIndex.meta[hazard].name} 
          value={this.props.riskIndex[geoid][hazard]}
          score={this.props.riskIndex[geoid][`${hazard}_SCORE`]} 
          link={`/risk-index/h/${hazard}`} 
        />
      ))

    let nonHazards = Object.keys(this.props.riskIndex.meta)
      .filter(d => isNaN(this.props.riskIndex[geoid][d]) )
      .filter(d => !hazard || hazard === d)
      .map((hazard,i) => (
        <HazardOverview key={i} title={this.props.riskIndex.meta[hazard].name} value={'N/A'} score={'N/A'} link={`/risk-index/h/${hazard}`} />
      )) 
    
    return (
      <div className='projects-list'>
        {hazards}
        {nonHazards}  
      </div>
    ) 
  }
}

const mapDispatchToProps = { getHazardTotal };

const mapStateToProps = state => {
  return {
    riskIndex: state.riskIndex,
    router: state.router,
    falcor: state.graph
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardList))
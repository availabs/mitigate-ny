 import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'


import { createMatchSelector } from 'react-router-redux';
import { getHazardDetail } from 'store/modules/riskIndex'

import {processSheldus5year} from 'utils/sheldusUtils'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

class GeographyHazardScoreTable extends Component {
  state = {
    loading: true
  }

  fetchFalcorDeps() {
    let geoid = this.props.geoid || '36'
    let geoLevel = this.props.geoLevel || 'counties'
    const { params } = createMatchSelector({ path: '/risk-index/h/:hazard' })(this.props) || {}
    const hazard = params.hazard
    return this.props.falcor.get(
      ['geo', geoid, geoLevel]
    ).then(data => {
      let geographies = data.json.geo['36'][geoLevel]
      return this.props.falcor.get(
        ['riskIndex','meta', hazard , ['id', 'name']],
        ['geo', geographies, ['name']],
        ['riskIndex', geographies, hazard, ['score','value']],
        ['sheldus', geographies, hazard,{from: 1996, to: 2012}, ['num_events','property_damage', 'crop_damage', 'injuries', 'fatalities']]
      )
    }).then(data => {
      console.log('all data back', data)
      this.setState({loading: false})
      return data
    })
  }

  componentWillMount() {
    let geoid = this.props.geoid || '36'
    let geoLevel = this.props.geoLevel || 'counties'
    if (!this.props.riskIndex[geoid] || !this.props.riskIndex[geoid][geoLevel]) {
      this.props.getHazardDetail(geoid)
    } 
  }

  renderGraphTable(hazard) {
    let geoid = this.props.geoid || '36'
    let geoLevel = this.props.geoLevel || 'counties'
    if(!this.props.geoGraph[geoid] 
       || !this.props.geoGraph[geoid][geoLevel].value
       || !this.props.riskIndexGraph[this.props.geoGraph[geoid][geoLevel].value[0]]
       ) {
      return <ElementBox> Loading... </ElementBox>
    }

    let graphTableData = this.props.geoGraph[geoid][geoLevel].value
      .sort((ageoid, bgeoid) => {
        let bdata = processSheldus5year(this.props.sheldus[bgeoid][hazard],'property_damage')[2012]
        let adata = processSheldus5year(this.props.sheldus[ageoid][hazard],'property_damage')[2012]
        bdata = isNaN(bdata) ? 0 : bdata
        adata = isNaN(adata) ? 0 : adata
        
        return bdata - adata
      })
      .map((geoLevelid,i) => {
        let output =  { 'County': this.props.geo[geoLevelid].name, 'Rank': (i+1) }
        output[`${hazard} Score`] = this.props.riskIndexGraph[geoLevelid][hazard].score.toLocaleString()
        output[`${hazard} Events`] = processSheldus5year(this.props.sheldus[geoLevelid][hazard],'num_events','total')[2012]
        output[`${hazard} Loss`] = processSheldus5year(this.props.sheldus[geoLevelid][hazard],'property_damage','total')[2012].toLocaleString()
        return output
      })
    
    return (
      <TableBox 
        title={this.props.riskIndexGraph.meta[hazard].name}  
        data={graphTableData}
      />
    )

  }
  renderTable (hazard) {
    let geoid = this.props.geoid || '36'
    let geoLevel = this.props.geoLevel || 'counties'
    if(!this.props.riskIndex[geoid]  || !this.props.riskIndex[geoid][geoLevel]) {
      return <ElementBox> Loading... </ElementBox>
    }
    let tableData = Object.keys(this.props.riskIndex[geoid][geoLevel])
      .sort((a,b) => {
        let bdata = this.props.riskIndex[geoid][geoLevel][b][`${hazard}_SCORE`]
        let adata = this.props.riskIndex[geoid][geoLevel][a][`${hazard}_SCORE`]
        bdata = isNaN(bdata) ? 0 : bdata
        adata = isNaN(adata) ? 0 : adata
        return bdata - adata
      })
      .map((childId,i) => {
      let output =  { 'County': this.props.geo[childId].name, 'Rank': (i+1) }
      output[`${hazard} Score`] = this.props.riskIndex[geoid][geoLevel][childId][`${hazard}_SCORE`].toLocaleString()

      return output
    })
    return (
      <TableBox 
        title={this.props.riskIndex.meta[hazard].name}  
        data={tableData} 
      />
    )
  }

  render () {
    const { params } = createMatchSelector({ path: '/risk-index/h/:hazard' })(this.props) || {}
    return (
      <div>
       {this.renderGraphTable(params.hazard)}
       {this.renderTable(params.hazard.toUpperCase())}
      </div>
    ) 
  }
}

const mapDispatchToProps = { getHazardDetail };

const mapStateToProps = state => {
  return {
    riskIndexGraph: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    geoGraph: state.graph.geo || {},
    riskIndex: state.riskIndex,
    router: state.router,
    geo: state.geo
    
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(GeographyHazardScoreTable))

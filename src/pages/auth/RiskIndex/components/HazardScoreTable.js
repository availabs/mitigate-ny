 import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'


import { createMatchSelector } from 'react-router-redux';

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
        ['sheldus', geographies, hazard,{from: 1996, to: 2012}, ['num_events','property_damage', 'crop_damage', 'injuries', 'fatalities']],
        ['severeweather', geographies, hazard,{from: 1996, to: 2012}, ['num_events','property_damage', 'crop_damage', 'injuries', 'fatalities']]
      )
    }).then(data => {
      console.log('all data back', data)
      this.setState({loading: false})
      return data
    })
  }

  renderGraphTable(hazard, type) {
    let geoid = this.props.geoid || '36'
    let geoLevel = this.props.geoLevel || 'counties'
    if(!this.props.geoGraph[geoid] 
       || !this.props.geoGraph[geoid][geoLevel].value
       || !this.props.riskIndexGraph[this.props.geoGraph[geoid][geoLevel].value[0]]
       || !this.props[type][this.props.geoGraph[geoid][geoLevel].value[0]]
       || !this.props[type][this.props.geoGraph[geoid][geoLevel].value[0]][hazard]
       ) {
      return <ElementBox> Loading... </ElementBox>
    }

    let graphTableData = this.props.geoGraph[geoid][geoLevel].value
      .sort((ageoid, bgeoid) => {
        let bdata = processSheldus5year(this.props[type][bgeoid][hazard],'property_damage')[2012]
        let adata = processSheldus5year(this.props[type][ageoid][hazard],'property_damage')[2012]
        bdata = isNaN(bdata) ? 0 : bdata
        adata = isNaN(adata) ? 0 : adata
        
        return bdata - adata
      })
      .map((geoLevelid,i) => {
        let output =  { 'County': this.props.geoGraph[geoLevelid].name }
        output[`${hazard} Score`] = this.props.riskIndexGraph[geoLevelid][hazard].score.toLocaleString()
        output[`${hazard} Events`] = processSheldus5year(this.props[type][geoLevelid][hazard],'num_events','total')[2012]
        output[`${hazard} Loss`] = processSheldus5year(this.props[type][geoLevelid][hazard],'property_damage','total')[2012].toLocaleString()
        return output
      })
    
    return (
      <TableBox 
        title={this.props.riskIndexGraph.meta[hazard].name}  
        data={graphTableData}
        pageSize={10}
      />
    )

  }
  
  render () {
    const { params } = createMatchSelector({ path: '/risk-index/h/:hazard' })(this.props) || {}
    return (
      <div>
       {this.renderGraphTable(params.hazard, 'sheldus')}
      </div>
    ) 
  }
}

const mapDispatchToProps = { };

const mapStateToProps = state => {
  return {
    riskIndexGraph: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeweather: state.graph.severeweather || {},
    geoGraph: state.graph.geo || {},
    router: state.router,
    
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(GeographyHazardScoreTable))

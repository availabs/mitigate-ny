import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { createMatchSelector } from 'react-router-redux';

import { sumData } from 'utils/sheldusUtils'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

class GeographyHazardScoreTable extends Component {
  state = {
    loading: true
  }

  fetchFalcorDeps() {
    let geoid = this.props.geoid || '36'
    let geoLevel = this.props.geoLevel || 'counties'
    let dataType = this.props.dataType || 'sheldus'
    const { params } = createMatchSelector({ path: '/hazards/:hazard' })(this.props) || {}
    const hazard = params.hazard
    return this.props.falcor.get(
      ['geo', geoid, geoLevel]
    ).then(data => {
      let geographies = data.json.geo['36'][geoLevel]
      return this.props.falcor.get(
        ['riskIndex','meta', hazard , ['id', 'name']],
        ['geo', geographies, ['name']],
        [dataType, geographies, hazard,{from: 1996, to: 2017}, ['num_events','property_damage', 'crop_damage', 'injuries', 'fatalities']] 
      )
    }).then(data => {
      this.setState({loading: false})
      return data
    })
  }

  renderGraphTable(hazard) {
    let geoid = this.props.geoid || '36'
    let geoLevel = this.props.geoLevel || 'counties'
    let dataType = this.props.dataType || 'sheldus'
    let year = this.props.year || 2017
    let sumTime = 10
    if(!this.props.geoGraph[geoid] 
       || !this.props.geoGraph[geoid][geoLevel].value
       || !this.props[dataType][this.props.geoGraph[geoid][geoLevel].value[0]]
       || !this.props[dataType][this.props.geoGraph[geoid][geoLevel].value[0]][hazard]
       ) {
      return <ElementBox> Loading... </ElementBox>
    }

    let graphTableData = this.props.geoGraph[geoid][geoLevel].value
      .sort((ageoid, bgeoid) => {

        let bdata = sumData(this.props[dataType][bgeoid][hazard],'property_damage',sumTime)[year]
        let adata = sumData(this.props[dataType][ageoid][hazard],'property_damage',sumTime)[year]
        bdata = isNaN(bdata) ? 0 : bdata
        adata = isNaN(adata) ? 0 : adata
        
        return bdata - adata
      })
      .map((geoLevelid,i) => {
        let output =  { 'County': this.props.geoGraph[geoLevelid].name }
        output[`${hazard} Events`] = sumData(this.props[dataType][geoLevelid][hazard],'num_events', sumTime)[year]
        output[`${hazard} Loss`] = sumData(this.props[dataType][geoLevelid][hazard],'property_damage', sumTime)[year].toLocaleString()
        return output
      })
    
    return (
      <TableBox 
        title={this.props.riskIndexGraph.meta[hazard].name}  
        data={graphTableData}
        pageSize={this.props.pageSize || 12}
      />
    )

  }
  
  render () {
    const hazard = this.props.hazard || 'riverine'
    return (
      <div>
       {this.renderGraphTable(hazard)}
      </div>
    ) 
  }
}

const mapDispatchToProps = { };

const mapStateToProps = state => {
  return {
    riskIndexGraph: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeweather: state.graph.severeWeather || {},
    geoGraph: state.graph.geo || {},
    router: state.router,
    
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(GeographyHazardScoreTable))

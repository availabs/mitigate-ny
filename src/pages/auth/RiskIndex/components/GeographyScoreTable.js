import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { createMatchSelector } from 'react-router-redux';
import { getHazardDetail } from 'store/modules/riskIndex';

import { processSheldus5year, sumData, avgData } from 'utils/sheldusUtils'

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
    return this.props.falcor.get(
      ['geo', geoid, geoLevel],
      ['riskIndex', 'hazards' ]
    ).then(data => {
      let geographies = data.json.geo['36'][geoLevel]
      return this.props.falcor.get(
        ['riskIndex','meta', data.json.riskIndex.hazards , ['id', 'name']],
        ['geo', geographies, ['name']],
        ['riskIndex', geographies, data.json.riskIndex.hazards, ['score','value']],
        [dataType, geographies, data.json.riskIndex.hazards, {from: 2007, to: 2017}, ['num_events','property_damage', 'crop_damage', 'injuries', 'fatalities']]
      )
    }).then(data => {
      console.log('all data back', data)
      this.setState({loading: false})
      return data
    })
  }

  renderGraphTable(geoid,type) {
    let geoLevel = this.props.geoLevel || 'counties'
    let dataType = this.props.dataType || 'sheldus'
    let year = this.props.year || 2017
    let sumTime = 10

    if(this.state.loading
       || !this.props.geoGraph[geoid][geoLevel].value[0]
       || !this.props.geoGraph[this.props.geoGraph[geoid][geoLevel].value[0]]
       || !this.props[dataType][this.props.geoGraph[geoid][geoLevel].value[0]]) {
      return <ElementBox> {this.state.loading.toString()} Loading... </ElementBox>
    }

    let graphTableData = this.props.geoGraph[geoid][geoLevel].value
      .map((geoLevelid,i) => {
        let output =  { 'County': this.props.geoGraph[geoLevelid].name, 'Total Loss': 0 }
        this.props.riskIndexGraph.hazards.value
          .filter(hazard => ['avalanche', 'volcano'].indexOf(hazard) === -1)
          .forEach(hazard => {
            //output[`${hazard} Score`] = this.props.riskIndexGraph[geoLevelid][hazard].score.toLocaleString()
            //output[`${hazard} Events`] = processSheldus5year(this.props.sheldus[geoLevelid][hazard],'num_events','total')[2012]
            output[`${hazard} Loss`] = (parseInt((sumData(this.props[dataType][geoLevelid][hazard],'property_damage',10)[year] / 1000)).toLocaleString())
            output['Total Loss'] += sumData(this.props[dataType][geoLevelid][hazard],'property_damage',sumTime)[year]
        })
        output['Total Loss'] = parseInt(output['Total Loss']/1000)
        return output
      }).sort((a,b) => b['Total Loss'] - a['Total Loss']) 
      .map(d => {
        d['Total Loss'] = d['Total Loss'].toLocaleString()
        return d
      })
    
    return (
      <TableBox
        title={'NY Hazard Loss by County'}
        desc={`in $1000 `}
        data={graphTableData}
        pageSize={62}
      />
    )

  }

  render () {
    const { params } = createMatchSelector({ path: '/risk-index/g/:geoid' })(this.props) || {}
    return (
      <div>
       {this.renderGraphTable(params.geoid)}
      </div>
    ) 
  }
}

const mapDispatchToProps = { getHazardDetail };

const mapStateToProps = state => {
  return {
    riskIndexGraph: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeweather: state.graph.severeweather || {},
    geoGraph: state.graph.geo || {},
    riskIndex: state.riskIndex,
    router: state.router,
    geo: state.geo
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(GeographyHazardScoreTable))

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { createMatchSelector } from 'react-router-redux';
import { getHazardDetail } from 'store/modules/riskIndex';

import { processSheldus5year } from 'utils/sheldusUtils'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

class GeographyHazardScoreTable extends Component {
  state = {
    loading: true
  }

  fetchFalcorDeps() {
    let geoid = this.props.geoid || '36'
    let geoLevel = this.props.geoLevel || 'counties'
    return this.props.falcor.get(
      ['geo', geoid, geoLevel],
      ['riskIndex', 'hazards' ]
    ).then(data => {
      let geographies = data.json.geo['36'][geoLevel]
      return this.props.falcor.get(
        ['riskIndex','meta', data.json.riskIndex.hazards , ['id', 'name']],
        ['geo', geographies, ['name']],
        ['riskIndex', geographies, data.json.riskIndex.hazards, ['score','value']],
        ['sheldus', geographies, data.json.riskIndex.hazards, {from: 2007, to: 2012}, ['num_events','property_damage', 'crop_damage', 'injuries', 'fatalities']]
      )
    }).then(data => {
      console.log('all data back', data)
      this.setState({loading: false})
      return data
    })
  }

  renderGraphTable(geoid) {
    let geoLevel = this.props.geoLevel || 'counties'
    console.log('rgt',this.props)
    if(this.state.loading
       || !this.props.geoGraph[geoid][geoLevel].value[0]
       || !this.props.geoGraph[this.props.geoGraph[geoid][geoLevel].value[0]]) {
      return <ElementBox> {this.state.loading.toString()} Loading... </ElementBox>
    }

    let graphTableData = this.props.geoGraph[geoid][geoLevel].value
      // .sort((ageoid, bgeoid) => {
      //   let bdata = processSheldus5year(this.props.sheldus[bgeoid][hazard],'property_damage')[2012]
      //   let adata = processSheldus5year(this.props.sheldus[ageoid][hazard],'property_damage')[2012]
      //   bdata = isNaN(bdata) ? 0 : bdata
      //   adata = isNaN(adata) ? 0 : adata
        
      //   return bdata - adata
      // })
      .map((geoLevelid,i) => {
        let output =  { 'County': this.props.geoGraph[geoLevelid].name, 'Total Loss': 0 }
        this.props.riskIndexGraph.hazards.value
          .filter(hazard => ['tsunami', 'avalanche', 'volcano'].indexOf(hazard) === -1)
          .forEach(hazard => {
            //output[`${hazard} Score`] = this.props.riskIndexGraph[geoLevelid][hazard].score.toLocaleString()
            //output[`${hazard} Events`] = processSheldus5year(this.props.sheldus[geoLevelid][hazard],'num_events','total')[2012]
            output[`${hazard} Loss`] = (parseInt((processSheldus5year(this.props.sheldus[geoLevelid][hazard],'property_damage','total')[2012] / 1000)).toLocaleString())
            output['Total Loss'] += processSheldus5year(this.props.sheldus[geoLevelid][hazard],'property_damage','total')[2012]
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

  componentWillMount() {
    let geoid = this.props.geoid || '36'
    let geoLevel = this.props.geoLevel || 'counties'
    if (!this.props.riskIndex[geoid] || !this.props.riskIndex[geoid][geoLevel]) {
      this.props.getHazardDetail(geoid)
    } 
  }

  renderTable (geoid) {
    let geoLevel = this.props.geoLevel || 'counties'
    if(!this.props.riskIndex[geoid] || !this.props.riskIndex[geoid][geoLevel]) {
      return <ElementBox> Loading... </ElementBox>
    }
    let tableData = Object.keys(this.props.riskIndex[geoid][geoLevel])
      // .sort((a,b) => {
      //   let bdata = this.props.riskIndex[geoid][geoLevel][b][`${hazard}_SCORE`]
      //   let adata = this.props.riskIndex[geoid][geoLevel][a][`${hazard}_SCORE`]
      //   bdata = isNaN(bdata) ? 0 : bdata
      //   adata = isNaN(adata) ? 0 : adata
      //   return bdata - adata
      // })
      .map((childId,i) => {
      let output =  { 'County': this.props.geo[childId].name }
      Object.keys(this.props.riskIndex.meta)
        .filter(hazard => ['TSUNAMI', 'AVALANCHE', 'VOLCANO'].indexOf(hazard) === -1)
        .forEach(hazard => {
          let hazardName = this.props.riskIndex.meta[hazard].name
          output[`${hazardName}`] = this.props.riskIndex[geoid][geoLevel][childId][`${hazard}_SCORE`].toLocaleString()
          output[`${hazardName}`] = isNaN(output[`${hazardName}`]) ? '' : output[`${hazardName}`]
        })
      return output
    })
    return (
      <TableBox 
        data={tableData}
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
    geoGraph: state.graph.geo || {},
    riskIndex: state.riskIndex,
    router: state.router,
    geo: state.geo
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(GeographyHazardScoreTable))

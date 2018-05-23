import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createMatchSelector } from 'react-router-redux';
import { getHazardDetail } from 'store/modules/riskIndex'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

class GeographyHazardScoreTable extends Component {
  
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
       {this.renderTable(params.geoid)}
      </div>
    ) 
  }
}

const mapDispatchToProps = { getHazardDetail };

const mapStateToProps = state => {
  return {
    riskIndex: state.riskIndex,
    router: state.router,
    geo: state.geo
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(GeographyHazardScoreTable)

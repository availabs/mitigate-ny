import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
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

  renderTable (hazard) {
    let geoid = this.props.geoid || '36'
    let geoLevel = this.props.geoLevel || 'counties'
    if(!this.props.riskIndex[geoid] || !this.props.riskIndex[geoid][geoLevel]) {
      return <ElementBox> Loading... </ElementBox>
    }
    let tableData = Object.keys(this.props.riskIndex[geoid][geoLevel])
      .sort((a,b) => {
        return this.props.riskIndex[geoid][geoLevel][b][`${hazard}_SCORE`] - this.props.riskIndex[geoid][geoLevel][a][`${hazard}_SCORE`]
      })
      .map((childId,i) => {
      let output =  { 'County': childId, 'Rank': (i+1) }
      output[`${hazard} Score`] = this.props.riskIndex[geoid][geoLevel][childId][`${hazard}_SCORE`].toLocaleString()
      return output
    })
    return (
      <TableBox title={hazard}  data={tableData} />
    )
  }

  render () {
    const { params } = createMatchSelector({ path: '/risk-index/h/:hazard' })(this.props) || {}
    return (
      <div>
       {this.renderTable(params.hazard)}
      </div>
    ) 
  }
}

const mapDispatchToProps = { getHazardDetail };

const mapStateToProps = state => {
  return {
    riskIndex: state.riskIndex,
    router: state.router
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(GeographyHazardScoreTable)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { history } from "store"

import { createMatchSelector } from 'react-router-redux';
import { getHazardDetail } from 'store/modules/riskIndex';

import { processSheldus5year, sumData, avgData } from 'utils/sheldusUtils'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

class GeographyHazardScoreTable extends Component {
  constructor(props) {
    super(props);

    const { params } = createMatchSelector({ path: '/risk-index/g/:geoid' })(props) || { params: { geoid: '36' } },
      { geoid } = params,
      geoLevel = (geoid.length === 2) ? 'counties' : 'cousubs';

    this.state = {
      geoLevel,
      geoid,
      dataType: 'sheldus',
      year: 2012
    }
  }

  componentWillReceiveProps(newProps) {
    const { params } = createMatchSelector({ path: '/risk-index/g/:geoid' })(newProps) || { params: { geoid: '36' } },
      { geoid } = params;
    let geoLevel, geojson;
    switch (geoid.length) {
      case 5:
        geoLevel = 'cousubs';
        break;
      default:
        geoLevel = 'counties';
        break;
    }
    this.setState({ geoid, geoLevel });
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldState.geoid != this.state.geoid) {
      this.fetchFalcorDeps();
    }
  }

  fetchFalcorDeps() {
    const { geoid, geoLevel, dataType } = this.state;
    return this.props.falcor.get(
      ['geo', geoid, geoLevel],
      ['riskIndex', 'hazards']
    ).then(data => {
      let geographies = data.json.geo[geoid][geoLevel],
        hazards = data.json.riskIndex.hazards;
      return this.props.falcor.get(
        ['riskIndex', 'meta', hazards, ['id', 'name']],
        ['geo', geographies, ['name']],
        ['riskIndex', geographies, hazards, ['score', 'value']],
        [dataType, geographies, hazards, { from: 2007, to: 2012 }, ['num_events','property_damage', 'crop_damage', 'injuries', 'fatalities']]
      )
    })
  }

  setGeoid(geoid) {
    let url = "/risk-index/g/36";
    switch (geoid.toString().length) {
      case 5:
        url = `/risk-index/g/${ geoid }`
        break;
    }
    history.push(url);
  }

  renderGraphTable() {
    const { geoid, geoLevel, dataType, year } = this.state;
    let graphTableData = [], countyName = "",
      columns = { [geoLevel]: true, 'Total Loss': true };
    try {
      countyName = (geoLevel === 'cousubs') ? this.props.geoGraph[geoid].name : "";
      graphTableData = this.props.geoGraph[geoid][geoLevel].value
        .map((geoLevelid, i) => {
          let output =  {
            [geoLevel]: this.props.geoGraph[geoLevelid].name,
            'Total Loss': 0,
            "total-loss": 0,
            geoid: geoLevelid
          };
          this.props.riskIndexGraph.hazards.value
            .filter(hazard => ['tsunami', 'avalanche', 'volcano'].indexOf(hazard) === -1)
            .forEach(hazard => {
              //output[`${hazard} Score`] = this.props.riskIndexGraph[geoLevelid][hazard].score.toLocaleString()
              //output[`${hazard} Events`] = processSheldus5year(this.props.sheldus[geoLevelid][hazard],'num_events','total')[2012]
              const column = `${ hazard } Loss`;
              columns[column] = true;
              const processedSheldus = processSheldus5year(this.props.sheldus[geoLevelid][hazard], 'property_damage', 'total');
              output[column] = parseInt((processedSheldus[year] / 1000)).toLocaleString();
              output['Total Loss'] += processedSheldus[year];
              output['total-loss'] += processedSheldus[year];
          })
          output['Total Loss'] = parseInt(output['Total Loss'] / 1000).toLocaleString();
          return output;
        })
        .sort((a, b) => b['total-loss'] - a['total-loss'])
    }
    catch (e) {
      return <ElementBox>Loading...</ElementBox>
    }

    const onClick = (geoLevel === 'counties') ?
      row => this.setGeoid(row.geoid) : null
    
    return (
      <TableBox
        title={ `NY Hazard Loss ${ (geoLevel === 'counties') ? 'by County' : `for ${ countyName }` }` }
        desc={ `in $1000 ` }
        data={ graphTableData }
        columns={ Object.keys(columns) }
        onClick={ onClick }
      />
    )

  }

  componentWillMount() {
    const { geoid, geoLevel } = this.state;
    if (!this.props.riskIndex[geoid] || !this.props.riskIndex[geoid][geoLevel]) {
      this.props.getHazardDetail(geoid)
    } 
  }

  // renderTable () {
  //   const { geoid, geoLevel } = this.state;
  //   if(!this.props.riskIndex[geoid] || !this.props.riskIndex[geoid][geoLevel]) {
  //     return <ElementBox> Loading... </ElementBox>
  //   }
  //   let tableData = Object.keys(this.props.riskIndex[geoid][geoLevel])
  //     // .sort((a,b) => {
  //     //   let bdata = this.props.riskIndex[geoid][geoLevel][b][`${hazard}_SCORE`]
  //     //   let adata = this.props.riskIndex[geoid][geoLevel][a][`${hazard}_SCORE`]
  //     //   bdata = isNaN(bdata) ? 0 : bdata
  //     //   adata = isNaN(adata) ? 0 : adata
  //     //   return bdata - adata
  //     // })
  //     .map((childId,i) => {
  //     let output =  { 'County': this.props.geo[childId].name }
  //     Object.keys(this.props.riskIndex.meta)
  //       .filter(hazard => ['TSUNAMI', 'AVALANCHE', 'VOLCANO'].indexOf(hazard) === -1)
  //       .forEach(hazard => {
  //         let hazardName = this.props.riskIndex.meta[hazard].name
  //         output[`${hazardName}`] = this.props.riskIndex[geoid][geoLevel][childId][`${hazard}_SCORE`].toLocaleString()
  //         output[`${hazardName}`] = isNaN(output[`${hazardName}`]) ? '' : output[`${hazardName}`]
  //       })
  //     return output
  //   })
  //   return (
  //     <TableBox 
  //       data={tableData}
  //       pageSize={62}
  //     />
  //   )
  // }

  render () {
    return (
      <div>
       { this.renderGraphTable() }
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

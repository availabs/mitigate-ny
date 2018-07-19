import React, { Component } from 'react';
import { connect } from 'react-redux';

import { processSheldus5year, sumData, avgData } from 'utils/sheldusUtils'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

class GeographyHazardScoreTable extends Component {

  renderGraphTable() {
    const { geoid, geoLevel, dataType, year } = this.props;
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
              const column = `${ hazard } Loss`;
              columns[column] = true;
              const processedSheldus = processSheldus5year(this.props[dataType][geoLevelid][hazard], 'property_damage', 'total');
              output[column] = parseInt((processedSheldus[year] / 1000)).toLocaleString();
              output['Total Loss'] += processedSheldus[year];
              output['total-loss'] += processedSheldus[year];
          })
          output['Total Loss'] = parseInt(output['Total Loss'] / 1000).toLocaleString();
          return output;
        })
        .sort((a, b) => b['total-loss'] - a['total-loss']);
    }
    catch (e) {
      return <ElementBox>Loading...</ElementBox>
    }

    const onClick = (geoLevel === 'counties') ?
      row => this.props.setGeoid(row.geoid) : null
    
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

  render () {
    return (
      <div>
       { this.renderGraphTable() }
      </div>
    ) 
  }
}

const mapStateToProps = state => ({
    riskIndexGraph: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeWeather: state.graph.severeWeather || {},
    geoGraph: state.graph.geo || {},
    riskIndex: state.riskIndex,
    router: state.router,
    geo: state.geo
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GeographyHazardScoreTable)

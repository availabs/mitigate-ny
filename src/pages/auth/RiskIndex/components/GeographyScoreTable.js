import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import * as d3scale from "d3-scale";

import {
  processSheldus5year,
  getHazardName,
  fnum
} from 'utils/sheldusUtils'

import {
  EARLIEST_YEAR,
  LATEST_YEAR
} from "./yearsOfSevereWeatherData";

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

class GeographyScoreTable extends React.Component {

  getHazardName(hazard) {
    try {
      return this.props.riskIndexGraph.meta[hazard].name;
    }
    catch (e) {
      return getHazardName(hazard)
    }
  }

    fetchFalcorDeps() {
      const { geoLevel, dataType, geoid } = this.props;

      return this.props.falcor.get(
          ['riskIndex', 'hazards'],
          ['geo', geoid, geoLevel]
      )
      .then(data => {
          const hazards = data.json.riskIndex.hazards,
            geoids = data.json.geo[geoid][geoLevel];
          return this.props.falcor.get(
            ['riskIndex', 'meta', hazards, ['id', 'name']],
            ['geo', geoids, ['name']],
            ['riskIndex', geoids, hazards, ['score', 'value']],
            [dataType, geoids, hazards, { from: EARLIEST_YEAR, to: LATEST_YEAR }, ['property_damage', 'total_loss', 'num_events','num_episodes', 'num_loans']]
          )
      })
    }

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
              const column = this.getHazardName(hazard);//`${ hazard } Loss`;
              columns[column] = true;
              const processedSheldus = processSheldus5year(this.props[dataType][geoLevelid][hazard], 'property_damage', 'total');
              output[column] = fnum(processedSheldus[year]);
              output['Total Loss'] += processedSheldus[year];
          })
          output['Total Loss'] = fnum(output['Total Loss']);
          return output;
        })
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

GeographyScoreTable.defaultProps = {
  geoLevel: 'counties',
  geoid: '36',
  year: LATEST_YEAR,
  dataType: "severeWeather"
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(GeographyScoreTable))

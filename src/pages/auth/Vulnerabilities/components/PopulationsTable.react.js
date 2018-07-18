import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import * as d3format from "d3-format"

import { createMatchSelector } from 'react-router-redux';

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

import {
  EARLIEST_YEAR,
  LATEST_YEAR,
  YEARS_OF_ACS_DATA
} from "./yearsOfAcsData";

const format = d3format.format(",d")

const GEO_LEVEL_NAMES = {
  counties: "County",
  cousubs: "County Subdivisions"
}

class PopulationsTable extends Component {
  render () {
    const geoGraph = this.props.geoGraph,
      { geoid, geoLevel } = this.props,
      GEO_LEVEL = (geoLevel === "counties") ? geoLevel : 'cousubs',
      GEOID = geoid,
      data = [];
    try {
      geoGraph[GEOID][GEO_LEVEL].value.forEach(geoid => {
        let row = { [GEO_LEVEL]: geoGraph[geoid].name, geoid };
        YEARS_OF_ACS_DATA.forEach(year => {
          row[year] = geoGraph[geoid][year].population;
        })
        let earliest = row[EARLIEST_YEAR],
          latest = row[LATEST_YEAR],

          currentYear = EARLIEST_YEAR;
        while ((earliest === 0) && (currentYear <= LATEST_YEAR)) {
          earliest = row[++currentYear];
        }

        currentYear = LATEST_YEAR;
        while ((latest === 0) && (currentYear >= EARLIEST_YEAR)) {
          latest = row[--currentYear];
        }

        row.change = format(latest - earliest);

        YEARS_OF_ACS_DATA.forEach(year => {
          row[year] = format(geoGraph[geoid][year].population);
        })
        data.push(row);
      });
    }
    catch (e) {
      return <ElementBox>Loading...</ElementBox>;
    }
    const columns = [GEO_LEVEL, ...YEARS_OF_ACS_DATA, 'change'];
    data.sort((a, b) => a[GEO_LEVEL] < b[GEO_LEVEL] ? -1 : 1);
    const onClick = (GEO_LEVEL == 'counties') ?
      row => this.props.setGeoid(row.geoid)
      : null;
    return (
      <TableBox
        title={ `NY Populations by ${ GEO_LEVEL_NAMES[GEO_LEVEL] }` }
        data={ data }
        columns={ columns }
        filterKey={ GEO_LEVEL }
        onClick={ onClick }/>
    )
  }
}

const mapStateToProps = state => ({
  geoGraph: state.graph.geo,
  router: state.router
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(PopulationsTable))

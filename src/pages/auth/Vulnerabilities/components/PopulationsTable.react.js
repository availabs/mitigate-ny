import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { createMatchSelector } from 'react-router-redux';
import { getHazardDetail } from 'store/modules/riskIndex';

import { processSheldus5year } from 'utils/sheldusUtils'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

const EARLIEST_YEAR = 2009,
  LATEST_YEAR = 2016;

class PopulationsTable extends Component {
  constructor(props) {
    super(props);
    const years = [];
    for (let y = EARLIEST_YEAR; y <= LATEST_YEAR; ++y) {
      years.push(y);
    }
    this.state = {
      years
    }
  }

  fetchFalcorDeps() {
    return this.props.falcor.get(
      ['geo', '36', 'counties']
    )
    .then(falcorResponse => {
      const geoids = falcorResponse.json.geo[36].counties;
      return this.props.falcor.get(
        ['geo', geoids, this.state.years, 'population'],
        ['geo', geoids, ['name']]
      );
    })
  }

  render () {
    const geoGraph = this.props.geoGraph;
    let data = [];
    try {
      const counties = geoGraph[36].counties.value;
      counties.forEach(geoid => {
        let row = { county: geoGraph[geoid].name };
        this.state.years.forEach(year => {
          row[year] = geoGraph[geoid][year].population;
        })
        row.change = row[LATEST_YEAR] - row[EARLIEST_YEAR];
        data.push(row);
      }, this);
    }
    catch (e) {
      return <ElementBox>Loading...</ElementBox>;
    }
    const columns = ['county', ...this.state.years, 'change'];
    data.sort((a, b) => a.county < b.county ? -1 : 1);
    return (
      <TableBox
        title={ 'NY Populations by County' }
        data={ data }
        columns={ columns }
        filterKey={ 'county' }/>
    )
  }
}

const mapDispatchToProps = { getHazardDetail };

const mapStateToProps = state => {
  return {
    geoGraph: state.graph.geo,
    router: state.router
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(PopulationsTable))

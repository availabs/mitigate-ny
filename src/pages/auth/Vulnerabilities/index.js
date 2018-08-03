import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux';

import { history } from "store"

import { getChildGeo } from 'store/modules/geo'

import Element from 'components/light-admin/containers/Element'

import PopulationsMap from "./components/PopulationsMap.react"
import PopulationsTable from "./components/PopulationsTable.react"

import Viewport from "components/mapping/escmap/Viewport"

import {
  YEARS_OF_ACS_DATA
} from "./components/yearsOfAcsData";

class Vulnerabilities extends Component {
  constructor(props) {
    super(props);

    const { params } = createMatchSelector({ path: '/vulnerabilities/g/:geoid' })(props) || { params: { geoid: '36' } },
      { geoid } = params,
      geoLevel = (geoid.length === 2) ? 'counties' : 'tracts-cousubs';

    this.state = {
      viewport: Viewport(),
      geoLevel,
      geoid
    }

    this.setGeoid = this.setGeoid.bind(this);
  }

  componentWillReceiveProps(newProps) {
    switch (this.state.geoLevel) {
      case 'counties':
        if (!this.props.geo['36'].counties.features.length &&
            newProps.geo['36'].counties.features.length) {
          this.state.viewport.fitGeojson(newProps.geo['36'].counties);
        }
        break;
      case 'tracts-cousubs':
        if (!this.props.geo['36'].tracts.features.length &&
            newProps.geo['36'].tracts.features.length) {
          const { geoid } = this.state,
            geojson = this.props.geo['36'].counties.features.reduce((a, c) => {
              return c.properties.geoid === geoid ? c : a;
            }, null)
          this.state.viewport.fitGeojson(geojson);
        }
        break;
    }
    const { params } = createMatchSelector({ path: '/vulnerabilities/g/:geoid' })(newProps) || { params: { geoid: '36' } },
      { geoid } = params;
    let geoLevel, geojson;
    switch (geoid.length) {
      case 5:
        geoLevel = 'tracts-cousubs';
        geojson = this.props.geo['36'].counties.features.reduce((a, c) => {
          return c.properties.geoid === geoid ? c : a;
        }, null)
        break;
      default:
        geoLevel = 'counties';
        geojson = this.props.geo['36'].counties;
        break;
    }
    this.state.viewport.fitGeojson(geojson);
    this.setState({ geoid, geoLevel });
  }

  componentWillMount() {
    this.props.getChildGeo('36', 'counties');
    this.props.getChildGeo('36', 'tracts');
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldState.geoid !== this.state.geoid) {
      this.fetchFalcorDeps();
    }
  }

  setGeoid(geoid) {
    let url = "/vulnerabilities";
    switch (geoid.toString().length) {
      case 5:
        url = `/vulnerabilities/g/${ geoid }`
        break;
    }
    history.push(url);
  }

  fetchFalcorDeps() {
    const { geoid, geoLevel } = this.state,
      geoLevels = geoLevel.split("-");
    return this.props.falcor.get(
        ...geoLevels.map(geoLevel => ['geo', geoid, geoLevel])
    )
    .then(falcorResponse => {
        return this.props.falcor.get(
          ...[].concat(...geoLevels.map(geoLevel => {
            const geoids = falcorResponse.json.geo[geoid][geoLevel];
            return [
              ['geo', geoids, YEARS_OF_ACS_DATA, 'population'],
              ['geo', geoids, ['name']]
            ];
          }))
        )
    })
  }

  render () {
    return (
    	<Element>
    		<h6 className="element-header">New York Statewide Populations</h6>
        <div className='row'>
          <div className='col-lg-12'>
            <PopulationsMap { ...this.state }
              setGeoid={ this.setGeoid }/>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-12'>
            <PopulationsTable { ...this.state }
              setGeoid={ this.setGeoid }/>
          </div>
        </div>
    	</Element>
    )
  }
}

const mapStateToProps = state => ({
    user: state.user,
    router: state.router,
    geo: state.geo
})

const mapDispatchToProps = {
  getChildGeo
};

const component = connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Vulnerabilities));

export default [
  {
    icon: 'icon-map',
    path: '/vulnerabilities',
    name: 'Vulnerability',
    exact: true,
    mainNav: true,
    auth: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    breadcrumbs: [
      {name: 'Vulnerabilities', path: '/vulnerabilities'}
    ],
    component,
    // subMenus: [[
    //   {name: 'By Hazard', path: '/risk-index/'},
    //   {name: 'By Geography', path: '/risk-index/g/36'},
    // ]]
  },
  {
    icon: 'icon-map',
    path: '/vulnerabilities/g/:geoid',
    name: 'Vulnerabilities',
    exact: true,
    mainNav: false,
    auth: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    breadcrumbs: [
      {name: 'Vulnerabilities', path: '/vulnerabilities'},
      {param: 'geoid', path: '/vulnerabilities/g/'},
    ],
    component,//: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Vulnerabilities))
    // subMenus: [[
    //   {name: 'By Hazard', path: '/risk-index/'},
    //   {name: 'By Geography', path: '/risk-index/g/36'},
    // ]]
  }
]

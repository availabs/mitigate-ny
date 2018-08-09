import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { createMatchSelector } from 'react-router-redux';

import * as d3scale from "d3-scale";

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import HazardEventsMapController from "./components/HazardEventsMapController"

import {
  EARLIEST_YEAR,
  LATEST_YEAR
} from "./components/yearsOfSevereWeatherData";

const D3_CATEGORY20 = [
  "#1f77b4",
  "#aec7e8",
  "#ff7f0e",
  "#ffbb78",
  "#2ca02c",
  "#98df8a",
  "#d62728",
  "#ff9896",
  "#9467bd",
  "#c5b0d5",
  "#8c564b",
  "#c49c94",
  "#e377c2",
  "#f7b6d2",
  "#7f7f7f",
  "#c7c7c7",
  "#bcbd22",
  "#dbdb8d",
  "#17becf",
  "#9edae5"
];

const COLOR_SCALE = d3scale.scaleOrdinal()
    .range(D3_CATEGORY20);

class Test extends React.Component {
  render() {
    return (
      <Element>
        <h6 className="element-header">Map Test</h6>

        <HazardEventsMapController
          showLegend={ true }
          numMaps={ 12 }
          { ...this.state }
          />

      </Element>
    )
  }
}

const mapStateToProps = state => {
  return {
    riskIndex: state.riskIndex,
    router: state.router
  };
};

const mapDispatchToProps = {};

export default [
  {
    path: '/test',
    name: 'Map Test',
    mainNav: false,
    breadcrumbs: [
    	{name: 'Map Test', path: '/test'}
    ],
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Test))
  }
]
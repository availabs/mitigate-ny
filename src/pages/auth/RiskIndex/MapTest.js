import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import HazardEventsMapController from "./components/HazardEventsMapController"
import SbaChoropleth from "./components/SbaChoropleth"

class Test extends React.Component {

  state = {
    years: "All Time"
  }

  fetchFalcorDeps() {
    return this.props.falcor.get(
      ["riskIndex", "hazards"]
    )
  }

  toggleYears() {
    const years = (this.state.years === "Individual Years") ? "All Time" : "Individual Years";
    this.setState({ years });
  }

  render() {
    try {
      const hazards = this.props.riskIndex.hazards.value;
      return (
        <Element>
          <h6 className="element-header">Map Test</h6>

          <HazardEventsMapController
            allTime={ true }
            hazard={ "riverine" }
            numMaps={ 1 }/>

        </Element>
      )
    }
    catch (e) {
      return <ElementBox>Loading...</ElementBox>
    }
  }
}

const mapStateToProps = state => {
  return {
    riskIndex: state.graph.riskIndex,
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
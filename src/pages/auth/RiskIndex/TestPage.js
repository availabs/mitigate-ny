import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import HazardEventsMapController from "./components/HazardEventsMapController"

class Test extends React.Component {

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

          <div className="row">
            <div className="col-12">
              <ElementBox>
                <HazardEventsMapController
                  hazard="riverine"/>
              </ElementBox>
            </div>
          </div>

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
    name: 'Test Page',
    mainNav: false,
    breadcrumbs: [
    	{name: 'Test Page', path: '/test'}
    ],
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Test))
  }
]
import React from 'react';

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import HazardEventsMapController from "./components/HazardEventsMapController"
import SbaChoropleth from "./components/SbaChoropleth"

class Test extends React.Component {

  state = {
    hazard: "hurricane",
    years: "Individual Years"
  }

  toggleYears() {
    const years = (this.state.years === "Individual Years") ? "All Time" : "Individual Years";
    this.setState({ years });
  }

  render() {
    return (
      <Element>
        <h6 className="element-header">Map Test</h6>

        <HazardEventsMapController
          showLegend={ false }
          { ...this.state }
          numMaps={ 0 }/>

        <div className="row">
          <div className="col-lg-12">
            <ElementBox>
              <SbaChoropleth
                toggle={ this.toggleYears.bind(this) }
                { ...this.state }/>
            </ElementBox>
          </div>
        </div>

      </Element>
    )
  }
}

export default [
  {
    path: '/test',
    name: 'Map Test',
    mainNav: false,
    breadcrumbs: [
    	{name: 'Map Test', path: '/test'}
    ],
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    component: Test
  }
]
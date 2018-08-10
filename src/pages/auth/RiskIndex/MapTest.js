import React from 'react';

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import HazardEventsMapController from "./components/HazardEventsMapController"
import SbaChoropleth from "./components/SbaChoropleth"

class Test extends React.Component {
  render() {
    return (
      <Element>
        <h6 className="element-header">Map Test</h6>

{ true ? null :
        <div className="row">
          <ElementBox>
            <HazardEventsMapController
              numMaps={ 21 }
              { ...this.state }/>
          </ElementBox>
        </div>
}

        <div className="row">
          <div className="col-lg-12">
            <ElementBox>
              <SbaChoropleth />
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
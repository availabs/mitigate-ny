import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'
import CapabilitiesSummaryTable from "components/mitigate-ny/CapabilitiesSummaryTable"
import NfipLossesChoropleth from "components/mitigate-ny/NfipLossesChoropleth"
import NfipLossesTable from "components/mitigate-ny/NfipLossesTable"

class TestPage extends React.Component {

  render() {
    try {
      return (
        <Element>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <NfipLossesChoropleth />
              </ElementBox>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <NfipLossesTable />
              </ElementBox>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <NfipLossesTable geoLevel="counties"/>
              </ElementBox>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <CapabilitiesSummaryTable
                    title= "Statewide Programs Summary by Hazard"
                    groupBy= "hazard"
                    columns= {["programs",
                              "regional",
                              "statewide",
                              "local"]}
                  filterBy= "program"
                  pageSize= { 9 }
                  />
              </ElementBox>
            </div>
          </div>    

        </Element>
      )
    }
    catch (e) {
      return (
        <Element>
          <ElementBox>
            There was an error...
          </ElementBox>
          <ElementBox style={ { color: "red" } }>
            { e.message }
          </ElementBox>
        </Element>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    router: state.router
  };
};

const mapDispatchToProps = {};

export default [
  {
    path: '/test',
    exact: true,
    name: 'Test Page',
    mainNav: false,
    breadcrumbs: [
    	{ name: 'Test Page', path: '/test' }
    ],
    menuSettings: { image: 'none', scheme: 'color-scheme-light' },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(TestPage))
  }
]
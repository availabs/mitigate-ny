import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import CapabilitiesSummaryTable from "components/mitigate-ny/CapabilitiesSummaryTable"
import CapabilitiesTable from "pages/auth/RiskIndex/components/CapabilitiesTable"

class TestPage extends React.Component {

  render() {
    try {
      return (
        <Element>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <CapabilitiesSummaryTable />
              </ElementBox>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <CapabilitiesSummaryTable
                  groupBy="agency"
                  columns={ [
                    "programs",
                    "measures",
                    "actions",
                    "hazards",
                    "capabilities",
                    "goals",
                    "funding",
                    "budget",
                    "staff",
                    "contract staff",
                    "regional",
                    "statewide",
                    "local"
                  ] }/>
              </ElementBox>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <CapabilitiesSummaryTable
                  groupBy="capability"
                  columns={ [
                    "programs",
                    "measures",
                    "actions",
                    "hazards",
                    "agencies",
                    "goals",
                    "funding",
                    "budget",
                    "staff",
                    "contract staff",
                    "regional",
                    "statewide",
                    "local"
                  ] }/>
              </ElementBox>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-12'>
              <ElementBox>
                <CapabilitiesSummaryTable
                  groupBy="goal"
                  columns={ [
                    "programs",
                    "measures",
                    "actions",
                    "hazards",
                    "agencies",
                    "capabilities",
                    "funding",
                    "budget",
                    "staff",
                    "contract staff",
                    "regional",
                    "statewide",
                    "local"
                  ] }/>
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
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'
import Submenus from './risk-submenus'
import NfipTable from 'pages/auth/Capabilities/components/NfipTable'
import NfipChoropleth from 'pages/auth/Capabilities/components/NfipChoropleth'
import ElementBox from 'components/light-admin/containers/ElementBox'
import NfipLossesChoropleth from "components/mitigate-ny/NfipLossesChoropleth"
import NfipLossesTable from "components/mitigate-ny/NfipLossesTable"

class nfip extends Component {
  render () {
   return (
      <div className='property-single'>

        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingTop: 0, paddingBottom: 0}}>

            <div className="property-section">
              <Content content_id={`nfip`} />
            </div>


            <div className='col-lg-12'>
                <NfipLossesChoropleth />

                <NfipLossesTable
                title={ "NFIP Losses by Municipality" }
                />

                <NfipLossesTable
                geoLevel="counties"
                title={ "NFIP Losses by County" }
                />
            </div>

            <div className="property-section">
              <Content content_id={`riverine-repetitive_loss`} />
            </div>

            <div className="property-section">
               <h5>Map of Repetitive Flood Losses by Census Tract</h5>
               <NfipChoropleth/>
               <i style={{color: '#afafaf'}}>
                  Source: FEMA National Flood Insurance Program
                </i>
            </div>

            <div className="property-section">
               <NfipTable/>
            </div>



            <div className="property-section">
              <Content content_id={`nfip-rlstrategy`} />
            </div>

            <div className="property-section">
              <Content content_id={`nfip-acquisitions_process`} />
            </div>

            <div className="property-section">
              <Content content_id={`riverine-crs`} />
            </div>

            <div className="property-section">
              <Content content_id={`nfip-lossavoidance`} />
            </div>

          </div>
         </div>
      </div>
    )
  }
}



export default [
  {
    icon: 'icon-map',
    path: '/risk/nfip',
    name: 'nfip',
    exact: true,
    mainNav: false,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: Submenus,
    component: connect(() => ({}), {})(nfip),
  },
]

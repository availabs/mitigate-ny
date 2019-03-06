import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import { createMatchSelector } from 'react-router-redux'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import CapabilitiesTable from 'pages/auth/RiskIndex/components/CapabilitiesTable'
import subMenus from "./capabilities-submenu"

class Agency extends Component {
  render () {
    console.log('test', this.props)
    const  agencyId  = this.props.match.params.agencyId;
    
    return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '100%'}}>
            <div key={ agencyId }>
               <div className="property-section" style={{paddingTop: 30, paddingBottom: 30, borderBottom: '1px solid black'}}>
                 <div className='row'>
                    <div className='col-8'>
                    <Content content_id={`agency-${agencyId}_narrative`} />
                    </div>
                    <div className='col-4'>
                    <Content content_id={`agency-${agencyId}_logo`} />
                    </div>
                    <hr/>
                     <CapabilitiesTable 
                       title='Agency Capabilities' 
                       type="program"
                       agency={agencyId.toUpperCase()}
                       columns={ ["name" , "description" ,"hazards" , 'admin' , 'url'] }
                       filterColumns={ ["goal" , 'hazards' , 'admin'] }
                       urlColumn="url"
                       tableScroll={ true }
                       tableLink="/capabilities/manage/new"
                       tableLinkLabel="Add Your Agency Programs"
                       expandColumns={ ["description"] }/>
                </div>
               </div>

            </div>
          </div>

            
        </div>
       
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    router: state.router
  };
};


export default [
  {
    icon: 'icon-map',
    path: '/capabilities/agencies/:agencyId',
    name: 'Agency',
    mainNav: false,
    exact: true,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    subMenus: subMenus,
    component: connect(mapStateToProps, {})(Agency),
  }
]



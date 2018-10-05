import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'
import Planning from './Planning-process'
import Submenus from './about-submenus'
import ExecutiveSummary from './plan'
import Glossary from './glossary'
import Authorities from './authorities'
import News from './news'
import Implementation from './Implementation'
class About extends Component {
  render () {
return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">
          
            <div className="property-section">
              <Content content_id={`home-about`} />
            </div>

            <div className="property-section">
              <Content content_id={`section1-essentialterms`} />
            </div>

          </div>           
        </div>

        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '60%', paddingTop: 0, borderRight: 'none', paddingBottom: 0}}>
           <div className="property-section">
              <Content content_id={`essentialterms-4-phases`} />
            </div>
          </div>
          
          <div className='property-info-side' style={{maxWidth: '40%'}}>
            <div className='side-section-content' style={{paddingTop: 0, paddingBottom: 0 }}>
             <div className='projects-list row'>
                <Content content_id={`essentialterms-4-phases-img`} />
             </div>
            </div>    
          </div>
        </div>

      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main" style={{paddingTop: 0 }}>
            
            <div className="property-section">
              <Content content_id={`essentialterms-4-phases-2`} />
            </div>

            <div className="property-section">
              <Content content_id={`section1-strategicframework`} />
            </div>
          
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
    path: '/about',
    name: 'About',
    exact: true,
    mainNav: true,
    subMenus: Submenus,
    menuSettings: {image: 'none', 'scheme': 'color-scheme-light'},
    breadcrumbs: [
      {path: '/about'}
    ],
    component: connect(() => {}, {})(About),
  },
...Planning,
...ExecutiveSummary,
...Authorities,
...Glossary,
...News,
...Implementation,

]

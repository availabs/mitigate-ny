import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'
import ProjectBox from 'components/light-admin/containers/ProjectBox'

class Home extends Component {
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
          <div className="property-info-main" style={{maxWidth: '80%', paddingTop: 0}}>
           <div className="property-section">
              <Content content_id={`essentialterms-4-phases`} />
            </div>
          </div>
          
          <div className='property-info-side' style={{maxWidth: '20%'}}>
            <div className='side-section-content' style={{paddingTop: 0 }}>
             <div className='projects-list row'>
              <ProjectBox title={`4 Phases of Emergency Management`} style={{backgroundColor: '#f2f4f8', width:'100%'}}>
                <Content content_id={`essentialterms-4-phases-img`} />
              </ProjectBox>  
             </div>
            </div>    
          </div>

      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">
            
            <div className="property-section">
              <Content content_id={`section1-strategicframework`} />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
    )
  }
}


// <div className="property-section">
//   <Content content_id={`section2-glossary`} />
// </div>
// class Home extends Component {
//   render () {
//    return (
//     	<div>
//     		<Element>
//           <h6 className="element-header">MITIGATE NY</h6>
//           <div className='row'>
//             <div className='col-6'>
//               <Link to='/risk-index'>
//                 <ElementBox style={{height: '25vh', textAlign:'center', paddingTop: '14%'}}>
//                   <h4 style={{color:'#047bf8'}}>Risk Index</h4>
//                 </ElementBox>
//               </Link>
//             </div>
//             <div className='col-6'>
//               <ElementBox style={{height: '25vh', textAlign:'center', paddingTop: '14%'}}>
//                 <h4 style={{color:'#ddd'}}>Agencies</h4>
//               </ElementBox>
//             </div>
//           </div>
//           <div className='row'>
//             <div className='col-6'>
//                <ElementBox style={{height: '25vh', textAlign:'center', paddingTop: '14%'}}>
//                 <h4 style={{color:'#ddd'}}>Projects & Capabilities</h4>
//               </ElementBox>
//             </div>
//             <div className='col-6' >
//                <ElementBox style={{height: '25vh', textAlign:'center', paddingTop: '14%'}}>
//                 <h4 style={{color:'#ddd'}}>Asset Inventory</h4>
//               </ElementBox>
//             </div>
//           </div>
//         </Element>  		
//     	</div>
//     )
//   }
// }

const mapDispatchToProps = {};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home)
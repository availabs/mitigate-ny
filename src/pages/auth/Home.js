import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'

class Home extends Component {
  render () {
   return (
      <div className='property-single'>
        <div className='property-info-w'>
          <div className="property-info-main">
          
             <div className="property-section">
              <Content content_id={`section1-essentialterms`} />
            </div>

            <div className="property-section">
              <Content content_id={`section1-strategicframework`} />
            </div>

             <div className="property-section">
              <Content content_id={`section2-glossary`} />
            </div>

          </div>           
        </div>
      </div>
    )
  }
}

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
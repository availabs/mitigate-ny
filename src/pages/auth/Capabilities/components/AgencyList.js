import React, { Component } from 'react';
// import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'

class AgencyList extends Component {
  render () {
   let agencies = this.props.agency ? [this.props.agency] : this.props.agencies
   return (
        <div className='property-info-w'>
          <div className="property-info-main" style={{maxWidth: '100%'}}>
            {agencies.map(agencyId => {
              return (
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
                    </div>
                   </div>
                </div>
              )
            })}
          </div>
        </div>
    )
  }
}




const mapStateToProps = state => ({
    agencies: state.agencies.ids
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AgencyList)

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
            <h1>Agencies</h1>
            {agencies.map(agencyId => {
              return (
                <div>
                   <div className="property-section">
                    <Content content_id={`agency-${agencyId}_logo`} />
                  </div>
                  <div className="property-section">
                    <Content content_id={`agency-${agencyId}_narrative`} />
                  </div>

                  <div className="property-section">
                    <Content content_id={`agency-${agencyId}_casestudy`} />
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

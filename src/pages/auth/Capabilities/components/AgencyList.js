import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import Content from 'components/cms/Content'


class AgencyList extends Component {
  render () {
   let agencies = this.props.agency ? [this.props.agency] : this.props.agencies
   return (
        
          <div className="property-info-main" style={{maxWidth: '100%', backgroundColor: '#f2f4f8', paddingLeft: 5, paddingRight: 5}}>
            <div className="property-section" style={{paddingTop: 0, marginTop: 0, paddingBottom: 30, borderBottom: '1px solid black'}}>
              <div className='row' style={{display: 'flex', justifyContent: 'center'}}>
                {agencies.map(agencyId => {
                  return (
                    <Link to={'/capabilities/agencies/' + agencyId} key={ agencyId } className='element-box img-box' 
                      style={{margin:4,  display:'flex', alignItems: 'center', justifyContent: 'center', width:355, height: 220}}>    
                        <Content content_id={`agency-${agencyId}_logo`} />
                    </Link>
                  )
                })}
              </div>
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

import React from 'react'
import Content from 'components/cms/Content'

export default (props) => (        

        <div style={{backgroundColor: '#f8f9fa'}}>
          <div className='property-info-w'>
          
              <div className="property-info-main" style={{maxWidth: '50%' , borderLeft: 'none'}}>
                <div className="property-section">
                  <Content content_id={`footer-content`} />
                </div>
                
              </div>
            
            <div className="property-info-main" style={{maxWidth: '50%' , borderLeft: 'none'}}>
              <div className="property-section">
                  <Content content_id={`footer-comments`} />
                </div>
              </div>
            </div>
          </div>

)   
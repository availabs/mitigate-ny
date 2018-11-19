import React from 'react'
import { Link } from 'react-router-dom'
import Content from 'components/cms/Content'

import Logo from 'components/mitigate-ny/Logo'

export default (props) => {
  return props.menuSettings.noFooter ? '' : (        
    <div className="footer-w">
    <div className="fade3" />
    <div className="os-container">
        <div className="footer-i">
            <div className="row">
                <div className="col-sm-7 col-lg-3 b-r padded">
                    <Logo compact={ true } width="350"/>
                    <h3 className="heading-big">Mitigate NY</h3>
                    <h6 className="heading-small">New York State Hazard Mitigation Plan</h6>
                    
                </div>
                <div className="col-sm-5 col-lg-9">
                    <div className="row">
                        <div className="col-lg-5 b-r padded">
                            <h6 className="heading-small">Contact</h6>
                            <Content content_id={`footer-content`} />
                        </div>
                        <div className="col-lg-4 b-r padded">
                            <h6 className="heading-small">DHSES</h6>
                            <p>
                            <strong>Division of Homeland Security and Emergency Services (DHSES) - Mitigation Planning</strong><br/>
                            1220 Washington Ave., Building 7a, 4th Floor, Albany NY 12242 <br/>
                            518-292-2304 <br />
                            <a href="mailto:oem.hazmit@dhses.ny.gov?subject=RE%20State%20Hazard%20Mitigation%20Plan">email</a>
                            </p>
                        </div>
                        <div className="col-lg-3  padded">
                            <h6 className="heading-small">Public Feedback</h6>
                            <p><Link to='/comments'>Leave Feedback</Link></p>
                            
                        </div>
                        
                    </div>

                </div>
            </div>
        </div>
        <div className="deep-footer">Use of this site constitutes acceptance of our <a href="#">User Agreement</a> and <a href="#">Privacy Policy</a>. © 2017 Pinsupreme.com All rights reserved. </div>
    </div>
</div>

  )
}
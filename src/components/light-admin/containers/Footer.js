import React from 'react'
import { Link } from 'react-router-dom'


export default (props) => {
  return props.menuSettings.noFooter ? '' : (        
    <div className="footer-w">
    <div className="fade3" />
    <div className="os-container">
        <div className="footer-i">
            <div className="row">
                <div className="col-sm-7 col-lg-4 b-r padded">
                    <div className="logo-element" />
                    <h3 className="heading-big">Mitigate NY</h3>
                    <h6 className="heading-small">New York State Hazard Mitigation Plan</h6>
                    
                </div>
                <div className="col-sm-5 col-lg-8">
                    <div className="row">
                        <div className="col-lg-4 b-r padded">
                            <h6 className="heading-small">Locations</h6>
                            <p>Eric Krans - ekrans@albany.edu<br />
                      Albany Visualization and Informatics Lab<br />
                      Room 331<br />
                      1215 Western Ave. Albany, NY 12203<br /></p>
                        </div>
                        <div className="col-lg-4 b-r padded">
                            <h6 className="heading-small">Public Feedback</h6>
                            <p><Link to='/comments'>Leave Feedback</Link></p>
                        </div>
                        <div className="col-lg-4 padded">
                            <h6 className="heading-small">DHSES</h6>
                            <ul className="social-links">
                                <li>
                                    <a href="#"><i className="os-icon os-icon-facebook" /></a>
                                </li>
                                <li>
                                    <a href="#"><i className="os-icon os-icon-twitter" /></a>
                                </li>
                            </ul>
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
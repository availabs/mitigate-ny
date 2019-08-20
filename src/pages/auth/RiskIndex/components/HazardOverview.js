import React from 'react'
import { Link } from 'react-router-dom'
import ProjectBox from 'components/light-admin/containers/ProjectBox'

import LineGraph from 'components/charts/line/simple'

// import BarGraph from 'components/charts/bar/simple'
import { processSheldus } from 'utils/sheldusUtils'
import Content from 'components/cms/Content'

const LimitedAttributes = {
	num_events: "Occurances",
	property_damage: "Property Damage $"
}

const sheldusAttributes = {
	num_events: "Occurances",
	property_damage: "Property Damage $",
	crop_damage: "Crop Damage $",
	injuries: "Injuries",
	fatalities: "Fatalities"
}

export default (props) => (
	<Link className={`project-link col-${props.size}`} to={props.link || '/'} >
		<ProjectBox title={props.title} >
			<Content content_id={'hazard-by-year-probability'} />
		    <div className="row align-items-center">
		    { /*  <div className="col-sm-12">
		        <div className="row">
		          <div className="col-6" style={{textAlign:'center'}}>
		            <div className="el-tablo highlight">
		              <div className="label">Risk Score</div>
		              <div className="value">{props.score.toLocaleString()}</div>
		            </div>
		          </div>
		          <div className="col-6" style={{textAlign:'center'}}>
		            <div className="el-tablo highlight">
		              <div className="label">Avg Risk Value</div>
		              <div className="value">{props.value.toLocaleString()}</div>
		            </div>
		          </div>
		        </div>
		      </div> */ }
		      <div className="col-sm-12">
		        {
		        	Object.keys(props.display === 'full' ? sheldusAttributes : LimitedAttributes).map(key => {
		        		let fullData = processSheldus(props.sheldus, key)
			         	return(
					     	<div className="row" key={key}>
						        <div className="col-12" style={{textAlign:'center'}}>
						            <div className="el-tablo highlight">
						              <div className="label">{sheldusAttributes[key]}</div>

						            </div>
						       	</div>

						       	<div className="col-12">
						            <div style={{width: 'calc(100% + 110px)', height: 100, marginLeft: -50, marginTop: -20}}>
						              	<LineGraph data={fullData}/>
						              </div>
						          </div>
					         </div>
					    )
		         	})
		         }
		      </div>
		    </div>
		</ProjectBox>
	</Link>
)

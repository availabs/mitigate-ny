import React from 'react'
import { Link } from 'react-router-dom'
import ProjectBox from 'components/light-admin/containers/ProjectBox'

export default (props) => (
	<Link className='project-link' to={props.link || '/'} >
		<ProjectBox title={props.title} >
		    <div className="row align-items-center">
		      <div className="col-sm-5">
		        <div className="row">
		          <div className="col-6">
		            <div className="el-tablo highlight">
		              <div className="label">Risk Score</div>
		              <div className="value">{props.score.toLocaleString()}</div>
		            </div>
		          </div>
		          <div className="col-6">
		            <div className="el-tablo highlight">
		              <div className="label">Avg Risk Value</div>
		              <div className="value">{props.value.toLocaleString()}</div>
		            </div>
		          </div>
		        </div>
		      </div>
		      <div className="col-sm-5 offset-sm-2">
		        <div className="os-progress-bar primary">
		          <div className="bar-labels">
		            <div className="bar-label-left"><span>Progress</span><span className="positive">+10</span></div>
		            <div className="bar-label-right"><span className="info">72/100</span></div>
		          </div>
		          <div className="bar-level-1" style={{width: '100%'}}>
		            <div className="bar-level-2" style={{width: '72%'}}>
		              <div className="bar-level-3" style={{width: '36%'}} />
		            </div>
		          </div>
		        </div>
		      </div>
		    </div>
		</ProjectBox>
	</Link>
)

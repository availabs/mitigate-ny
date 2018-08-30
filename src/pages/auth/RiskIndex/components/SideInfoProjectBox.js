import React from 'react'

import ProjectBox from 'components/light-admin/containers/ProjectBox'

const BoxRow = ({ value, label }, i) =>
	<div className="row" key={ i }>   
		<div className="col-12" style={{textAlign:'center', paddingBottom: 30}}>
			<div className="el-tablo highlight">
            	<div className="value">{ value }</div>
            	<div className="label">{ label }</div>
          	</div>
        </div>
    </div>

export default ({ title, rows }) =>
    <ProjectBox title={ title } style={ { backgroundColor: '#f2f4f8', width:'100%' } }>
		<div className="row align-items-center">
			<div className="col-12">

				{ rows.map(BoxRow) }

            </div>
		</div>
    </ProjectBox>
import React, { Component } from 'react';


class PublicPlan extends Component {
  render () {
    return (
    	<div>
    		<h2>Public Plan</h2>
    		{JSON.stringify(this.props)}
    	</div>
    )
  }
}

export default {
	icon: 'icon-map',
	path: '/ny-mitigates',
	name: 'NYS Hazard Mitigation Plan',
	mainNav: true,
	component: PublicPlan
}
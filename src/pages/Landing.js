import React, { Component } from 'react';
import Home from './auth/Home'

class Landing extends Component {
  render () {
    return this.props.authed ? (
    	<Home />
    ) : (
    	<div>
    		<h2>Landing</h2>
    		Welcome to NY Mitigates.
    	</div>
    )
  }
}

export default {
	icon: 'icon-map',
	path: '/',
	exact: true,
	mainNav: true,
	name: 'Home',
	auth: false,
	component: Landing
}
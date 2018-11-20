  
import React, { Component } from 'react'
import MainMenu from './MainMenu'
// import MobileMenu from './MobileMenu'
import {
  Logo,
  LoginMenu,
  AvatarUser
} from './TopMenu'
// import './menu.css'


class Menu extends Component {
  
  render () {
    let currentPath = this.props.menus.filter(p => p.path === this.props.path)[0]


    let title = currentPath[0] ? currentPath[0].name : '' 
  	let defaultOptions = {
  		'location': 'menu-w',
  		'color': 'selected-menu-color-light',
  		'hover': 'menu-activated-on-hover',
  		'selected': 'menu-has-selected-link',
  		'image': this.props.menuSettings.image ? this.props.menuSettings.image :  'menu-with-image',
  		'scheme': this.props.menuSettings.scheme ? this.props.menuSettings.scheme : 'color-scheme-dark',
  		'style': 'color-style-transparent',
  		'submenucolor': 'sub-menu-color-light',
  		'position': 'menu-position-top', 
  		'layout': 'menu-layout-full',
  		'subemenustyle': this.props.menuSettings.subemenustyle ? this.props.menuSettings.subemenustyle :  'sub-menu-style-over'
  	}
    let displayOptions = Object.values(defaultOptions).join(' ')

    let dynamicStyle= {
      marginBottom: currentPath.subMenus ? 50 : 0
    }
    // console.log('menuProps', currentPath, dynamicStyle)
  	let userMenu = this.props.user && !!this.props.user.authed 
      ? <AvatarUser user={this.props.user} />
      : <LoginMenu />

    return (
  		<div>
			{/*<MobileMenu />*/}
	  		<div className={displayOptions} style={dynamicStyle}>
	            <Logo fill={this.props.menuSettings.image ?  '#5d87a1' : '#fff'}/>
	            {userMenu}
	            <h1 className="menu-page-header">{this.props.title}</h1>
	            <MainMenu {...this.props} />
	        </div>
       	</div>
  	) 
  }
}

export default Menu
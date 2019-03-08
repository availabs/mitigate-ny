import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'

import styled from 'styled-components'

const SideNavContainer = styled.div`
  position: relative;
  left: 0;
  
`

const SideNav = styled.div`
  width: 356px;
  border-right: 1px solid rgba(0,0,0,0.05);
` 

const SideNavItem = styled(Link)`
    padding: 20px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    cursor: pointer;
    display: block;
    font-weight: 500;
    line-height: 1.2;
    background-color: ${
      props => props.active ? '#047bf8' : 'none'
    }
    color: ${
      props => props.active ? '#fff' : '#334152'
    }

    :hover{
      background-color: ${ props => props.active ? '#047bf8' : '#f9f9f9'}
      color: ${ props => props.active ? '#fff' : 'default'}
      text-decoration: none;
    }

`

const SideNavComp = ({items, title, activeLink}) => (
    <SideNavContainer>
      <h4 style={{padding: 17, paddingTop: 30}}>{title}</h4>
      <SideNav>
        {items.map(item => <SideNavItem to={item.to} active={item.id === activeLink}>{item.name}</SideNavItem>)}
      </SideNav>
    </SideNavContainer>
)

export default SideNavComp



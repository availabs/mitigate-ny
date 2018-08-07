import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux';

import { history } from "store"

import {
  addActiveFilter,
  removeActiveFilter,
  setContentFilters,
  receiveContent
} from 'store/modules/cms';

import Element from 'components/light-admin/containers/Element'

import CMS_FilterPanel from './components/CMS_FilterPanel'
import CMS_ContentPanel from './components/CMS_ContentPanel'

import "./components/cms.css"

class CMS_HomePage extends React.Component {

  fetchFalcorDeps() {
    return this.props.falcor.get(
      ["content", "byIndex", "length"]
    )
    .then(response => {
      const length = response.json.content.byIndex.length;
      if (!length) return response;
      return this.props.falcor.get(
        ["content", "byIndex", { from: 0, to: length - 1 }, "content_id"]
      )
      .then(response => {
        const content_ids = [];
        for (let index = 0; index < length; ++index) {
          content_ids.push(response.json.content.byIndex[index].content_id);
        }
        return this.props.falcor.get(
          ["content", "byId", content_ids, ["attributes", "body", "created_at", "updated_at"]]
        )
        .then(response => {
          const content = [],
            filters = {};
          content_ids.forEach(content_id => {
            const {
              attributes,
              body,
              created_at,
              updated_at
            } = response.json.content.byId[content_id];
            for (const key in attributes) {
              if (!(key in filters)) {
                filters[key] = [];
              }
              if (!filters[key].includes(attributes[key])) {
                filters[key].push(attributes[key]);
              }
            }
            content.push({
              content_id,
              attributes,
              body: body,
              created_at: new Date(created_at),
              updated_at: new Date(updated_at)
            });
          });
          this.props.setContentFilters(Object.keys(filters).map(key => ({ heading: key, filters: filters[key] })));
          this.props.receiveContent(content);
          return response;
        })
      })
    })
  }

  deleteContent(content_id) {
    return this.props.falcor.call(
      ["content", "byId", "remove"],
      [content_id]
    ).then(response => {
      console.log("DELETE RESPONSE:",response);
      return response;
    })
  }

  render () {
    return (
    	<Element>
    		<h6 className="element-header">Content Management</h6>
        <div className='row'>

          <CMS_FilterPanel className="col-lg-3"/>

          <CMS_ContentPanel className="col-lg-9"
            deleteContent={ this.deleteContent.bind(this) }/>

        </div>
    	</Element>
    )
  }
}

const mapStateToProps = state => ({
    user: state.user,
    router: state.router,
    cms: state.cms
})

const mapDispatchToProps = {
  addActiveFilter,
  removeActiveFilter,
  setContentFilters,
  receiveContent
};

const component = connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CMS_HomePage));

export default [
  {
    icon: 'icon-map',
    path: '/cms',
    name: 'Content Management',
    exact: true,
    mainNav: false,
    auth: true,
    menuSettings: { image: 'none', 'scheme': 'color-scheme-light' },
    breadcrumbs: [
      { name: 'Content Management', path: '/cms' }
    ],
    component,
    // subMenus: [[
    //   {name: 'By Hazard', path: '/risk-index/'},
    //   {name: 'By Geography', path: '/risk-index/g/36'},
    // ]]
  }
]

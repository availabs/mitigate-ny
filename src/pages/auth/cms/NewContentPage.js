import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { createMatchSelector } from 'react-router-redux';
import MarkdownRenderer from 'react-markdown-renderer';

import { history } from "store"

import {
  setEditTarget,
  clearNewContentData
} from 'store/modules/cms';

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import CMS_ContentEditorPanel from './components/CMS_ContentEditorPanel'

class NewContentPage extends React.Component {

  fetchFalcorDeps() {
    const { params } = createMatchSelector({ path: '/cms/edit/:content_id' })(this.props) || { params: {} },
      { content_id } = params;
    if (!content_id) {
      this.props.clearNewContentData();
      return Promise.resolve();
    }
    return this.props.falcor.get(
      ['content', 'byId', content_id, ['attributes', 'body', 'created_at', 'updated_at']]
    )
    .then(response => {
      try {
        const {
          attributes,
          body,
          created_at,
          updated_at
        } = response.json.content.byId[content_id];
        if (attributes && body) {
          this.props.setEditTarget({ content_id, attributes, body, created_at, updated_at });
        }
      }
      catch (e) {
        history.goBack();
      }
    });
  }

  render () {
    const {
      content_id,
      attributes,
      body,
      isEditTarget
    } = this.props.cms.newContentData;
    const title = isEditTarget ? "Edit Content" : "New Content Creation";
    return (
    	<Element>
    		<h6 className="element-header">{ title }</h6>
        <div className='row'>

          <div className="col-lg-6">
            <CMS_ContentEditorPanel/>
          </div>

          <div className="col-lg-6">
            <ElementBox>
            <h5 className="form-header" style={ { borderBottom: "1px solid rgba(0, 0, 0, 0.1)" } }>
              Body Preview
            </h5>
              <div style={ { maxHeight: "571px", overflow: "auto" } }>
                <MarkdownRenderer markdown={ body }
                  options={ { html: true } }/>
              </div>
            </ElementBox>
          </div>

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
  setEditTarget,
  clearNewContentData
};

const component = connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NewContentPage));

export default [
  {
    icon: 'icon-map',
    path: '/cms/new',
    name: 'New Content Creation',
    exact: true,
    mainNav: false,
    auth: true,
    menuSettings: { image: 'none', 'scheme': 'color-scheme-light' },
    breadcrumbs: [
      { name: 'Content Management', path: '/cms' },
      { name: 'New Content Creation', path: '/cms/new' }
    ],
    component,
    // subMenus: [[
    //   {name: 'By Hazard', path: '/risk-index/'},
    //   {name: 'By Geography', path: '/risk-index/g/36'},
    // ]]
  },
  {
    icon: 'icon-map',
    path: '/cms/edit/:content_id',
    name: 'Edit Content',
    exact: true,
    mainNav: false,
    auth: true,
    menuSettings: { image: 'none', 'scheme': 'color-scheme-light' },
    breadcrumbs: [
      { name: 'Content Management', path: '/cms' },
      { param: 'content_id', path: '/cms/edit/' }
    ],
    component,
    // subMenus: [[
    //   {name: 'By Hazard', path: '/risk-index/'},
    //   {name: 'By Geography', path: '/risk-index/g/36'},
    // ]]
  }
]
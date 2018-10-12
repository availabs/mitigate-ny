import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import MarkdownRenderer from 'react-markdown-renderer';

import Element from 'components/light-admin/containers/Element'
import ElementBox from 'components/light-admin/containers/ElementBox'

import {
  sendSystemMessage
} from "store/modules/messages"
import {
  receiveComments
} from "store/modules/comments"

class CommentBox extends React.Component {
  state = {
    name: "",
    email: "",
    comment: ""
  }
  onChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();

    const {
        name,
        email,
        comment
    } = this.state;

    const errors = [];
    if (!name) {
      errors.push('Missing required parameter: name.')
    }
    if (!comment) {
      errors.push('Missing required parameter: comment.')
    }
    errors.forEach(e => this.props.sendSystemMessage(e));
    if (!errors.length) {
      this.props.postComment(this.state);
      this.setState({ name: "", email: "", comment: "" });
    }
  }
  render() {
    const {
      comment,
      name,
      email
    } = this.state;
    return (
      <div className='row'>
        <div className="col-sm-6">
          <ElementBox>
            <h5>Compose Your Comment...</h5>
            <form onSubmit={ this.onSubmit.bind(this) }>
              <div className="form-group">
                <div className="input-group">
                  <input type="text" id="name" value={ name }
                    className="form-control" required
                    placeholder="Enter your name..."
                    onChange={ this.onChange.bind(this) }/>
                  <div className="input-group-append">
                    <div className="input-group-text">required</div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <input type="email" id="email" value={ email }
                    className="form-control"
                    placeholder="Enter your email..."
                    onChange={ this.onChange.bind(this) }/>
                  <div className="input-group-append">
                    <div className="input-group-text">optional</div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <textarea value={ comment } id="comment"
                  className="form-control" required
                  onChange={ this.onChange.bind(this) }
                  placeholder="Enter comment..."/>
              </div>
              <div className="form-group clearfix">
                <span style={ { float: "right" } }>
                  <input type="submit" className="btn btn-primary"
                    value="Post Comment"/>
                </span>
              </div>
            </form>
          </ElementBox>
        </div>
        <div className="col-sm-6">
          <ElementBox>
            <h5>Preview Your Comment...</h5>
            <MarkdownRenderer markdown={ comment }
              options={ { html: true } }/>
          </ElementBox>
        </div>
      </div>
    )
  }
}
////
const Comment = ({ id, comment, name, email, authed, deleteComment }) =>
  <ElementBox>
    <h6>{ name }</h6>
    { !email ? null :
      <h6>{ email }</h6>
    }
    <MarkdownRenderer markdown={ comment }
      options={ { html: true } }/>
    { !authed ? null :
      <button className="btn btn-sm btn-danger"
        onClick={ e => deleteComment(id) }>
        Delete
      </button>
    }
  </ElementBox>
////

class Comments extends React.Component {
  state = {
    page: 0,
    numPerPage: 5,
    maxPages: 0
  }

  fetchFalcorDeps() {
    return this.props.falcor.get(
      ['comments', 'byIndex', 'length']
    )
    .then(res => res.json.comments.byIndex.length)
    .then(to => {
      return this.props.falcor.get(
        ['comments', 'byIndex', { from: 0, to }, 'id']
      )
      .then(res => {
        const ids = [];
        for (let i = 0; i < to; ++i) {
          const data = res.json.comments.byIndex[i];
          if (data) {
            ids.push(data.id);
          }
        }
        return ids;
      })
    })
    .then(ids => {
      if (!ids.length) return this.props.receiveComments([]);
      return this.props.falcor.get(
        ['comments', 'byId', ids, ['name', 'email', 'comment', 'created_at']]
      )
      .then(res => {
        const comments = [];
        for (const id of ids) {
          const {
            name,
            email,
            comment,
            created_at
          } = res.json.comments.byId[id];
          comments.push({
            name,
            email,
            comment,
            created_at,
            id
          });
        }
        this.props.receiveComments(comments);
      })
    })
  }

  postComment({ name, email, comment }) {
    this.props.falcor.call(
      ['comments', 'post'],
      [name, email, comment], [], []
    )
    .then(() => this.fetchFalcorDeps())
  }

  deleteComment(id) {
    const onConfirm = () => {
      this.props.falcor.call(
        ['comments', 'remove'],
        [id], [], []
      )
      .then(() => this.fetchFalcorDeps())
    }
    this.props.sendSystemMessage("Are you sure you want to delete this comment?",
      { id: `delete-comment-${ id }`,
        type: 'danger',
        duration: 0,
        onConfirm
      }
    )
  }

  componentWillReceiveProps(newProps) {
    this.updateState(newProps);
  }

  updateState(props) {
    const {
      comments
    } = props;
    const state = {
      ...this.state
    }
    let {
      page,
      numPerPage
    } = state;
    const maxPages = Math.max(Math.ceil(comments.length / numPerPage) - 1, 0);
    page = Math.min(maxPages, page);
    this.setState({ ...state, maxPages, page });
  }

  setPage(page) {
    this.setState({ page });
  }
  incPage() {
    const page = Math.min(this.state.page + 1, this.state.maxPages);
    this.setState({ page });
  }
  decPage() {
    const page = Math.max(this.state.page - 1, 0);
    this.setState({ page });
  }

  getPaginationRange() {
    const {
      page,
      maxPages
    } = this.state;

    let low = page - 2,
      high = page + 2;

    if (low < 0) high -= low;
    if (high > maxPages) low -= (high - maxPages);

    low = Math.max(low, 0);
    high = Math.min(high, maxPages);

    const range = [];
    for (let i = low; i <= high; ++i) {
      range.push(i);
    }
    return range;
  }

  render() {
    const { comments } = this.props,
      { authed } = this.props.user,
      {
        page,
        numPerPage,
        maxPages
      } = this.state;
      const range = this.getPaginationRange();
    try {
      return (
        <Element>

            <CommentBox postComment={ this.postComment.bind(this) }
              sendSystemMessage={ this.props.sendSystemMessage }/>

            <div className="row" style={ { marginTop: "10px" } }>
              <div className="col-sm-2"/>
              <div className="col-sm-8">
                <ElementBox>
            <div className="row">
              <div className="col-lg-8">
                <div>
                  Page: { page + 1 } of { maxPages + 1 }
                </div>
                <div className="btn-group">
                  <button className="btn btn-sm btn-outline-primary"
                    style={ { width: "4rem" } }
                    onClick={ this.setPage.bind(this, 0) }>
                    First
                  </button>
                  <button className="btn btn-sm btn-outline-primary"
                    style={ { marginLeft: "-2px", width: "4rem" } }
                    onClick={ this.decPage.bind(this) }>
                    Prev
                  </button>
                  {
                    range.map(p =>
                      <button className={ "btn btn-sm " + ((p == page) ? "btn-primary" : "btn-outline-primary") }
                        style={ { marginLeft: "-2px", width: "2rem" } }
                        onClick={ this.setPage.bind(this, p) } key={ p }>
                        { p + 1 }
                      </button>
                    , this)
                  }
                  <button className="btn btn-sm btn-outline-primary"
                    style={ { marginLeft: "-2px", width: "4rem" } }
                    onClick={ this.incPage.bind(this) }>
                    Next
                  </button>
                  <button className="btn btn-sm btn-outline-primary"
                    style={ { marginLeft: "-2px", width: "4rem" } }
                    onClick={ this.setPage.bind(this, maxPages) }>
                    Last
                  </button>
                </div>
              </div>
              {/*<div className="col-lg-4" style={ { marginTop: "-0.4em", marginBottom: "-0.4em" } }>
                <div className="row" style={ { marginBottom: "-3px" } }>
                  <div className="col-lg-3">
                    <label style={ { paddingTop: "0.4rem" } }
                      htmlFor="search-filter-key">Search:</label>
                  </div>
                  <div className="col-lg-9">
                    <select onChange={ this.setSearchFilterKey.bind(this) }
                      id="search-filter-key"
                      className="form-control form-control-sm"
                      style= { {
                        borderBottomLeftRadius: "0px",
                        borderBottomRightRadius: "0px",
                        paddingTop: "0",
                        paddingBottom: "0" } }
                      value={ this.state.searchFilterKey }>
                      <option value="content_id">Content ID</option>
                      <option value="body">Content Body</option>
                      <option value="keys">Attibute Keys</option>
                      <option value="values">Attribute Values</option>
                    </select>
                  </div>
                </div>
                <div>
                  <input type="text" value={ this.state.searchFilter }
                    style={ { borderTopRightRadius: "0px" } }
                    className="form-control form-control-sm"
                    onChange={ this.setSearchFilter.bind(this) }
                    placeholder="search for..."/>
                </div>
              </div>*/}
            </div>
                </ElementBox>
              </div>
            </div>

            <div className="row" style={ { marginTop: "10px" } }>
              <div className="col-sm-2"/>
              <div className="col-sm-8">
                {
                  comments
                    .sort((a, b) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf())
                    .slice(page * numPerPage, page * numPerPage + numPerPage)
                    .map((c, i) =>
                      <Comment key={ i } { ...c } authed={ authed }
                        deleteComment={ this.deleteComment.bind(this) }/>
                    )
                }
              </div>
            </div>

        </Element>
      )
    }
    catch (e) {
      return (
        <Element>
          <ElementBox>
            There was an error...
          </ElementBox>
          <ElementBox style={ { color: "red" } }>
            { e.message }
          </ElementBox>
        </Element>
      )
    }
  }
}

const mapStateToProps = state => ({
  router: state.router,
  comments: state.comments,
  user: state.user
})

const mapDispatchToProps = {
  sendSystemMessage,
  receiveComments
};

export default [
  {
    path: '/comments',
    exact: true,
    name: 'Comments',
    mainNav: false,
    breadcrumbs: [
    	{ name: 'Comments', path: '/comments' }
    ],
    menuSettings: { image: 'none', scheme: 'color-scheme-light' },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Comments))
  }
]
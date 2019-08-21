import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { history } from "store"
import { push } from 'react-router-redux';

import ElementBox from 'components/light-admin/containers/ElementBox'

import AttributesTable from "./CMS_AttributesTable"

import {
  updateNewContentData,
  updateContent
} from 'store/modules/cms';
import {
  sendSystemMessage
} from 'store/modules/messages';

class CMS_ContentEditorPanel extends React.Component {

	state = {
		key: "",
		value: "",
		oldKey: ""
	}

	onChange(e) {
		const id = e.target.id,
			value = e.target.value;
		const {
      		isEditTarget
    	} = this.props.cms.newContentData;
		switch (id) {
			case "key":
			case "value":
				this.setState({ [id]: value });
				break;
			case "content_id":
				if (isEditTarget) {
					this.props.updateNewContentData({ new_content_id: value });
					break;
				}
			default:
				this.props.updateNewContentData({ [id]: value });
		}
	}

	addAttribute() {
		let {
			attributes
		} = this.props.cms.newContentData;
		const {
			key,
			value,
			oldKey
		} = this.state;
		if (oldKey) {
			delete attributes[oldKey];
		}
		attributes = {
			...attributes,
			[key]: value
		}
		this.props.updateNewContentData({ attributes });
		this.setState({ key: "", value: "", oldKey: "" });
	}
	removeAttribute(key) {
		let {
			attributes
		} = this.props.cms.newContentData;
		delete attributes[key];
		this.props.updateNewContentData({ attributes: { ...attributes } });
	}
	editAttribute(key) {
		let {
			attributes
		} = this.props.cms.newContentData;
		this.setState({
			key: key, value: attributes[key],
			oldKey: key });
	}

	editContent(e) {
		e.preventDefault();

  	const {
    		content_id,
    		new_content_id,
    		attributes,
    		body
  	} = this.props.cms.newContentData;

    if (content_id && body) {
			this.props.falcor.set({
				paths: [
					['content', 'byId', content_id, ['content_id', 'body', 'attributes', 'updated_at', 'created_at']]
				],
				jsonGraph: {
					content: {
						byId: {
							[content_id]: {
								content_id: new_content_id,
								body,
								attributes: JSON.stringify(attributes)
							}
						}
					}
				}
			})
			.then(response => {
				this.props.sendSystemMessage(`Content "${ new_content_id }" was successfully edited.`, { type: "success" });
				if (new_content_id != content_id) {
					history.replace(`/cms/edit/${ new_content_id }`);
				};
        const {
          $__path,
          ...content
        } = response.json.content.byId[new_content_id];
  			this.props.updateContent(content);
			})
		}
	}

	saveContent(e) {
		e.preventDefault();

    	const {
      		content_id,
      		attributes,
      		body
    	} = this.props.cms.newContentData;

    	if (content_id && body) {
    		this.props.falcor.call(
    			['content', 'insert'],
    			[content_id, attributes, body], [], []
    		)
			.then(response => {
				this.props.sendSystemMessage(`Content "${ content_id }" was successfully created.`, { type: "success" });
				this.props.push(`/cms/edit/${ content_id }`)
			})
    	}
	}

	render() {
    	const {
      		content_id,
      		new_content_id,
      		attributes,
      		body,
      		isEditTarget
    	} = this.props.cms.newContentData;

    	const {
    		key,
    		value,
    		oldKey
    	} = this.state;

    	const disabled = (!key || !value);

    	const length = Object.keys(attributes).length;

    	const onSubmit = isEditTarget ? this.editContent.bind(this)
    						: this.saveContent.bind(this);
		return (
			<ElementBox>
				<form onSubmit={ onSubmit }>
					<h5 className="form-header" style={ { borderBottom: "1px solid rgba(0, 0, 0, 0.1)" } }>
						Content Editor
					</h5>

					<div className="form-group">
						<label htmlFor="#content_id">Content ID</label>
						<input type="text" required
							className="form-control form-control-sm"
							id="content_id"
							placeholder="Enter a content id..."
							value={ new_content_id || content_id }
							onChange={ this.onChange.bind(this) }/>
					</div>

					<div className="row" style={ { marginBottom: "1rem" } }>
						<div className="col-lg-4">
							<label htmlFor="#key">Attribute Key</label>
							<input type="text"
								className="form-control form-control-sm"
								id="key" value={ key }
								placeholder="Enter an attribute key..."
								onChange={ this.onChange.bind(this) }/>
						</div>
						<div className="col-lg-4">
							<label htmlFor="#key">Attribute Value</label>
							<input type="text"
								className="form-control form-control-sm"
								id="value" value={ value }
								placeholder="Enter an attribute value..."
								onChange={ this.onChange.bind(this) }/>
						</div>
						<div className="col-lg-4">
							<label>Add Attribute</label>
							<button className="btn btn-block btn-outline-primary"
								type="button" disabled={ disabled }
								onClick={ this.addAttribute.bind(this) }>
								{ oldKey ? "Edit" : "Add" } Attribute
							</button>
						</div>
					</div>

					{
						!length ? null :
						<div className="row">
							<div className="col-lg-12">
								<label>Current Attributes</label>
							</div>
						</div>
					}
					{
						!length ? null :
						<div className="row">
							<div className="col-lg-12">
								<AttributesTable attributes={ attributes }
									remove={ this.removeAttribute.bind(this) }
									edit={ this.editAttribute.bind(this) }/>
							</div>
						</div>
					}
					{
						!length ? null :
						<div style={ { marginBottom: "1rem" } }/>
					}

					<div className="form-group">
						<label htmlFor="#body">Content Body</label>
						<textarea className="form-control form-control-sm"
							rows="10"
							id="body"
							required
							value={ body }
							placeholder="Enter content body..."
							onChange={ this.onChange.bind(this) }/>
					</div>

					<div className="form-buttons-w">
						<input type="submit" className="btn btn-outline-success" value="Save Content"/>
					</div>

				</form>
			</ElementBox>
		)
	}
}

const mapStateToProps = state => ({
    user: state.user,
    router: state.router,
    cms: state.cms
})

const mapDispatchToProps = {
	updateNewContentData,
	sendSystemMessage,
	updateContent,
	push: url => dispatch => dispatch(push(url))
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CMS_ContentEditorPanel));

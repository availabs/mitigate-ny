import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import ElementBox from 'components/light-admin/containers/ElementBox'

import AttributesTable from "./CMS_AttributesTable"

import {
  updateNewContentData
} from 'store/modules/cms';

class CMS_ContentEditorPanel extends React.Component {

	state = {
		key: "",
		value: "",
		show: "hide"
	}

	onChange(e) {
		const id = e.target.id,
			value = e.target.value;
		switch (id) {
			case "key":
			case "value":
				this.setState({ [id]: value });
				break;
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
			value
		} = this.state;
		attributes = {
			...attributes,
			[key]: value
		}
		this.props.updateNewContentData({ attributes });
	}
	removeAttribute(key) {
		let {
			attributes
		} = this.props.cms.newContentData;
		delete attributes[key];
		this.props.updateNewContentData({ attributes: { ...attributes } });
	}

	editContent(e) {
		e.preventDefault();

    	const {
      		content_id,
      		attributes,
      		body
    	} = this.props.cms.newContentData;

    	if (content_id && body) {
			this.props.falcor.set({
				paths: [
					['content', 'byId', content_id, ['body', 'attributes']]
				],
				jsonGraph: {
					content: {
						byId: {
							[content_id]: {
								body,
								attributes: JSON.stringify(attributes)
							}
						}
					}
				}
			})
			.then(response => {
				this.props.showAlert(`Content "${ content_id }" was successfully edited.`);
				return response;
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
				this.props.showAlert(`Content "${ content_id }" was successfully created.`);
				return response;
			})
    		.catch(error => console.log("CALL ERROR:",error));
    	}
	}

	render() {
    	const {
      		content_id,
      		attributes,
      		body,
      		isEditTarget
    	} = this.props.cms.newContentData;

    	const {
    		key,
    		value
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
							value={ content_id }
							disabled={ isEditTarget }
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
								Add Attribute
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
									remove={ this.removeAttribute.bind(this) }/>
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
	updateNewContentData
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CMS_ContentEditorPanel));
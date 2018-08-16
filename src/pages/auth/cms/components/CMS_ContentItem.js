import React from 'react';

import ElementBox from 'components/light-admin/containers/ElementBox'

import AttributesTable from "./CMS_AttributesTable"
import BodyViewer from "components/cms/Content"

export default class ContentItem extends React.Component {
	state = {
		opened: false,
		attributesOpened: true
	}
	toggleOpened() {
		const opened = !this.state.opened;
		this.setState({ opened });
	}
	toggleAttributesOpened() {
		const attributesOpened = !this.state.attributesOpened;
		this.setState({ attributesOpened });
	}
	deleteContent() {
		this.props.sendSystemMessage(
			`Are you sure you with to delete content "${ this.props.content_id }"?`,
			{
				onConfirm: this.props.deleteContent.bind(this, this.props.content_id),
				id: `delete-content-${ this.props.content_id }`,
				type: "danger",
				duration: 0
			}
		)
	}
	render() {
		const {
			content_id,
			attributes,
			body,
			updated_at
		} = this.props;
		const hasAttributes = Object.keys(attributes).length;
		const {
			opened,
			attributesOpened
		} = this.state;
		return (
			<div className="row">
				<div className="col-lg-12">
					<ElementBox>
						<div className="row">
							<div className="col-lg-5">
								<button className="btn btn-lg btn-light" onClick={ this.toggleOpened.bind(this) }>
									<span style={ { padding: "0px 10px 0px 0px" } } className={ 'os-icon ' + (this.state.opened ? "os-icon-arrow-up4" : "os-icon-arrow-down3") }/>
									{ content_id }
								</button>
							</div>
							<div className="col-lg-4" style={ { paddingTop: "10px" } }>
								<h5 style={ { display: "inline-block", paddingRight: "10px" } }>Updated At:</h5>
								{ updated_at.toLocaleString() }
							</div>
							<div className="col-lg-3">
								<div className="float-right">
									<a href={ `/cms/edit/${ content_id }` }
										className="btn btn-lg btn-outline-primary">
										Edit
									</a>
									<a href="#" className="btn btn-lg btn-outline-danger"
										onClick={ this.deleteContent.bind(this) }>
										Delete
									</a>
								</div>
							</div>
						</div>
						{ !opened ? null :
							<div className="row" style={ { paddingTop: "10px" } }>
								{ !hasAttributes ? null :
									<div className={ `col-lg-${ attributesOpened ? 4 : 1 }` }
										onClick={ this.toggleAttributesOpened.bind(this) }>
										{ attributesOpened ? <AttributesOpened /> : <AttributesClosed /> }
										{ !attributesOpened ? null :
											<AttributesTable attributes={ attributes }/>
										}
									</div>
								}
								<div className={ `col-lg-${ !hasAttributes ? 12 : attributesOpened ? 8 : 11 }` }>
									<h5>Body</h5>
									<div style={ { maxHeight: "600px", overflow: "auto", paddingRight: "10px" } }>
										<BodyViewer content_id={ content_id }/>
									</div>
								</div>
							</div>
						}
					</ElementBox>
				</div>
			</div>
		)
	}
}

const AttributesOpened = () =>
	<h5>
		<span className="os-icon os-icon-arrow-left5"/>
		&nbsp;
		Attributes
	</h5>
const AttributesClosed = () =>
	<h5><span className="os-icon os-icon-arrow-right3"/></h5>
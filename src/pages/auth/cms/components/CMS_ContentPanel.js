import React from 'react';
import { connect } from 'react-redux';

import ElementBox from 'components/light-admin/containers/ElementBox'

import AttributesTable from "./CMS_AttributesTable"
import BodyViewer from "./CMS_BodyViewer"

class ContentItem extends React.Component {
	state = {
		opened: false
	}
	toggleOpened() {
		const opened = !this.state.opened;
		this.setState({ opened });
	}
	render() {
		const {
			content_id,
			attributes,
			body,
			updated_at
		} = this.props;
		return (
			<div className="row">
				<div className="col-lg-12">
					<ElementBox>
						<div className="row">
							<div className="col-lg-6">
								<button className="btn btn-lg btn-light" onClick={ this.toggleOpened.bind(this) }>
									<span style={ { padding: "0px 10px 0px 0px" } } className={ 'os-icon ' + (this.state.opened ? "os-icon-arrow-up4" : "os-icon-arrow-down3") }/>
									{ content_id }
								</button>
							</div>
							<div className="col-lg-4" style={ { paddingTop: "10px" } }>
								<h5 style={ { display: "inline-block", paddingRight: "10px" } }>Updated At:</h5>
								{ updated_at.toLocaleString() }
							</div>
							<div className="col-lg-2">
								<a href={ `/cms/edit/${ content_id }` }
									className="btn btn-lg btn-block btn-outline-primary">
									Edit <span className="os-icon os-icon-edit"/>
								</a>
							</div>
						</div>
						{ !this.state.opened ? null :
							<div className="row" style={ { paddingTop: "10px" } }>
								{ !Object.keys(attributes).length ? null :
									<div className="col-lg-4">
										<h5>Attributes</h5>
										<AttributesTable attributes={ attributes }/>
									</div>
								}
								<div className="col-lg-8">
									<h5>Body</h5>
									<BodyViewer content_id={ content_id }/>
								</div>
							</div>
						}
					</ElementBox>
				</div>
			</div>
		)
	}
}


class CMS_ContentPanel extends React.Component {
	render() {
		let {
			activeFilters,
			content
		} = this.props.cms;
		content = content.filter(c => {
			const keys = Object.keys(c.attributes);
			return activeFilters.reduce((a, c) => a || keys.includes(c), !activeFilters.length);
		})
		return (
          	<div className={ this.props.className }>
  				<ElementBox>
  					<div className="row">
  						<div className="col-lg-10"/>
  						<div className="col-lg-2">
  							<a href="/cms/new" className="btn btn-lg btn-outline-success btn-block">
  								<span style={ { fontWeight: "900" } }>NEW</span>
  								<span style={ { fontWeight: "900", fontSize: "1.5em" } } className="os-icon os-icon-plus-circle"/>
  							</a>
  						</div>
  					</div>
  				</ElementBox>
	      		{ 
	      			content.sort((a, b) => b.updated_at.valueOf() - a.updated_at.valueOf())
	      				.map(cntnt =>
			      			<ContentItem key={ cntnt.content_id } { ...cntnt }
			      				setEditTarget={ this.props.setEditTarget }/>
			      		)
		      	}
      		</div>
		)
	}
}

CMS_ContentPanel.defaultProps = {
	className: 'col-lg-9'
}

const mapStateToProps = state => ({
    user: state.user,
    router: state.router,
    cms: state.cms
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CMS_ContentPanel);
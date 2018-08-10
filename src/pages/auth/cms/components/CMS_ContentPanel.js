import React from 'react';
import { connect } from 'react-redux';

import ElementBox from 'components/light-admin/containers/ElementBox'

import AttributesTable from "./CMS_AttributesTable"
import ContentItem from "./CMS_ContentItem"

import {
  sendSystemMessage
} from 'store/modules/messages';

class CMS_ContentPanel extends React.Component {
	state = {
		page: 0,
		numPerPage: 6,
		filteredContent: [],
		maxPages: 0,
		searchFilterKey: "content_id",
		searchFilter: ""
	}

	componentWillReceiveProps(newProps) {
		this.updateState(newProps);
	}

	updateState(props, newState={}) {
		const {
			activeFilters,
			content
		} = props.cms;
		const state = {
			...this.state,
			...newState
		}
		let {
			page,
			numPerPage,

			searchFilterKey,
			searchFilter
		} = state;
		let filteredContent = content
			.sort((a, b) => b.updated_at.valueOf() - a.updated_at.valueOf());
		if (activeFilters.length) {
			filteredContent = filteredContent.filter(cntnt => {
				const values = Object.values(cntnt.attributes);
				return activeFilters.reduce((a, c) => a || values.includes(c), false);
			});
		}
		if (searchFilter.length) {
			filteredContent = filteredContent.filter(cntnt => {
				switch (searchFilterKey) {
					case "content_id":
						return cntnt.content_id.toLowerCase()
							.includes(searchFilter.toLowerCase());
					case "keys":
						return Object.keys(cntnt.attributes)
							.reduce((a, c) => a || c.toLowerCase().includes(searchFilter.toLowerCase())
								, false)
					case "values":
						return Object.values(cntnt.attributes)
							.reduce((a, c) => a || c.toLowerCase().includes(searchFilter.toLowerCase())
								, false)
					case "body":
						return cntnt.body.toLowerCase()
							.includes(searchFilter.toLowerCase());
				}
			})
		}
		const maxPages = Math.max(Math.ceil(filteredContent.length / numPerPage) - 1, 0);
		page = Math.min(maxPages, page);
		this.setState({ ...state, ...{ filteredContent, maxPages, page } });
	}

	setSearchFilter(e) {
		this.updateState(this.props, { searchFilter: e.target.value });
	}
	setSearchFilterKey(e) {
		this.updateState(this.props, { searchFilterKey: e.target.value });
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
		const {
			page,
			numPerPage,
			filteredContent,
			maxPages
		} = this.state;

		const range = this.getPaginationRange();
		
		const content = filteredContent
				.slice(page * numPerPage, page * numPerPage + numPerPage);
		return (
          	<div className={ this.props.className }>
  				<ElementBox>
  					<div className="row">
  						<div className="col-lg-6">
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
  						<div className="col-lg-4" style={ { marginTop: "-0.4em", marginBottom: "-0.4em" } }>
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
  						</div>
  						<div className="col-lg-2">
  							<a href="/cms/new" className="btn btn-lg btn-outline-success btn-block">
  								<span style={ { fontWeight: "900" } }>NEW</span>
  								<span style={ { fontWeight: "900", fontSize: "1.5em" } } className="os-icon os-icon-plus-circle"/>
  							</a>
  						</div>
  					</div>
  				</ElementBox>
	      		{ 
	      			content.map(cntnt =>
		      			<ContentItem key={ cntnt.content_id } { ...cntnt }
		      				deleteContent={ this.props.deleteContent }
		      				sendSystemMessage={ this.props.sendSystemMessage }/>
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

const mapDispatchToProps = {
	sendSystemMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(CMS_ContentPanel);
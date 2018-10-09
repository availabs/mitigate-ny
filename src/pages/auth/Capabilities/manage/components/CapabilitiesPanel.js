import React from 'react';
import { connect } from 'react-redux';

import { Link } from "react-router-dom"

import ElementBox from 'components/light-admin/containers/ElementBox'

// import AttributesTable from "./CMS_AttributesTable"
import CapabilityItem from "./CapabilityItem"

import {
  sendSystemMessage
} from 'store/modules/messages';

class CapabilitiesPanel extends React.Component {
	state = {
		page: 0,
		numPerPage: 5,
		filteredCapabilities: [],
		maxPages: 0,
		searchFilterKey: "",
		searchFilter: ""
	}

	componentWillReceiveProps(newProps) {
		this.updateState(newProps);
	}

	setSearchFilterKey(e) {
		this.updateState(this.props, { searchFilterKey: e.target.value });
	}
	setSearchFilter(e) {
		this.updateState(this.props, { searchFilter: e.target.value });
	}

	updateState(props=this.props, newState={}) {
		const {
			hazardFilters,
			agencyFilters,
			capabilities
		} = props.capabilities;
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

		let filteredCapabilities = capabilities
			.sort((a, b) => {
				const aDate = (new Date(a.updated_at)).valueOf(),
					bDate = (new Date(b.updated_at)).valueOf();
				if ((aDate === bDate) && a.name) {
					return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
				}
				return bDate - aDate
			})

		if (hazardFilters.length) {
			filteredCapabilities = filteredCapabilities.filter(c =>
				Boolean(c.hazards) && c.hazards.reduce((a, h) => a || hazardFilters.includes(h), false)
			)
		}
		if (agencyFilters.length) {
			filteredCapabilities = filteredCapabilities.filter(c =>
				Boolean(c.agency) && agencyFilters.includes(c.agency)
			)
		}
		if (searchFilter.length) {
			filteredCapabilities = filteredCapabilities.filter(cap => {
				switch (searchFilterKey) {
					case "name":
						return cap.name && cap.name.toLowerCase()
							.includes(searchFilter.toLowerCase());
					case "agency":
						return cap.agency && cap.agency.toLowerCase()
							.includes(searchFilter.toLowerCase());
					case "partners":
						return cap.partners && cap.partners.toLowerCase()
							.includes(searchFilter.toLowerCase());
					case "contact":
						return cap.contact && cap.contact.toLowerCase()
							.includes(searchFilter.toLowerCase());
				}
			})
		}

		const maxPages = Math.max(Math.ceil(filteredCapabilities.length / numPerPage) - 1, 0);
		page = Math.min(maxPages, page);

		this.setState({ ...state, filteredCapabilities, maxPages, page });
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
				filteredCapabilities,
				maxPages
			} = this.state,

			range = this.getPaginationRange(),
		
			capabilities = filteredCapabilities
				.slice(page * numPerPage, page * numPerPage + numPerPage);
		return (
          	<div className={ this.props.className }>
  				<ElementBox>
  					<div className="row">
  						<div className="col-sm-6">
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
	  									<option value="name">Name</option>
	  									<option value="agency">Agency</option>
	  									<option value="partners">Partners</option>
	  									<option value="contact">Contact</option>
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
  						<div className="col-sm-2">
  							<Link className="btn btn-lg btn-outline-success btn-block"
  								to="/capabilities/manage/new">
  								<span style={ { fontWeight: "900" } }>NEW</span>
  								<span style={ { fontWeight: "900", fontSize: "1.5em" } } className="os-icon os-icon-plus-circle"/>
  							</Link>
  						</div>
  					</div>
  				</ElementBox>
  				{
  					capabilities.map((c, i) =>
  						<CapabilityItem key={ c.id } { ...c }
  							deleteCapability={ this.props.deleteCapability }/>
  					)
  				}
      		</div>
		)
	}
}

CapabilitiesPanel.defaultProps = {
	className: 'col-sm-9'
}

const mapStateToProps = state => ({
    user: state.user,
    router: state.router,
    capabilities: state.capabilities
})

const mapDispatchToProps = {
	sendSystemMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(CapabilitiesPanel);
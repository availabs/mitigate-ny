import React from 'react';
import { connect } from 'react-redux';

import ElementBox from 'components/light-admin/containers/ElementBox'

import {
  toggleHazardFilter,
  toggleAgencyFilter
} from 'store/modules/capabilities';

import {
  getHazardName
} from 'utils/sheldusUtils';

const FilterItem = ({ filter, label, active, onClick }) =>
	<div className={ `filter-item ${ active ? "active" : "" }` }
		onClick={ e => { e.stopPropagation(); onClick(filter); } }>
		{ label }
	</div>

class FilterHeading extends React.Component {
	render() {
		const {
			heading,
			filters,
			toggleActiveFilter,
			activeFilters
		} = this.props;
		const isActive = activeFilters.reduce((a, c) =>
			a || filters.map(d => d.filter).includes(c)
		, false)
		return (
			<div className="filter-item filter-heading"
				onClick={ this.props.toggleOpened }>
				{ heading }
				{ !isActive ? null :
					<span className="os-icon os-icon-others-43 float-right"
						style={ { paddingTop: "1px", fontSize: "1.25em" } }/>
				}
				<div style={ { maxHeight: "485px", overflow: "auto" } }>
					{ !this.props.opened ? null :
						filters.sort((a, b) => a.label < b.label ? -1 : 1)
							.map(({ filter, label }) =>
								<FilterItem key={ filter }
									filter={ filter }
									label={ label }
									onClick={ toggleActiveFilter }
									active={ activeFilters.includes(filter) }/>
							, this)
					}
				</div>
			</div>
		)
	}
}

class FilterPanel extends React.Component {
	state = {
		opened: -1
	}

	toggleOpened(index) {
		let opened = -1;
		if (index !== this.state.opened) {
			opened = index;
		}
		this.setState({ opened })
	}

  	getHazardName(hazard) {
    	try {
      		return this.props.riskIndex.meta[hazard].name;
    	}
    	catch (e) {
      		return getHazardName(hazard);
    	}
  	}

	render() {
		const {
			hazardFilters,
			hazards,
			agencyFilters,
			agencies
		} = this.props;
		const mappedHazards = hazards.map(filter => ({ filter, label: this.getHazardName(filter) })),
			mappedAgencies = agencies.map(filter => ({ filter, label: filter }));
		return (
          	<div className={ this.props.className }>
				<ElementBox>
					<h5>Filters</h5>

					<FilterHeading heading="Agencies" filters={ mappedAgencies }
						toggleOpened={ this.toggleOpened.bind(this, 1) }
						opened={ this.state.opened === 1 }
						activeFilters={ agencyFilters }
						toggleActiveFilter={ this.props.toggleAgencyFilter }/>

					<FilterHeading heading="Hazards" filters={ mappedHazards }
						toggleOpened={ this.toggleOpened.bind(this, 0) }
						opened={ this.state.opened === 0 }
						activeFilters={ hazardFilters }
						toggleActiveFilter={ this.props.toggleHazardFilter }/>

				</ElementBox>
      		</div>
		)
	}
}

FilterPanel.defaultProps = {
	className: 'col-sm-3'
}

const mapStateToProps = state => ({
    user: state.user,
    router: state.router,
    hazardFilters: state.capabilities.hazardFilters,
    hazards: state.capabilities.hazards,
    agencyFilters: state.capabilities.agencyFilters,
    agencies: state.capabilities.agencies,
    riskIndex: state.graph.riskIndex
})

const mapDispatchToProps = {
  toggleHazardFilter,
  toggleAgencyFilter
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
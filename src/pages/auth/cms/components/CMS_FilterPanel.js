import React from 'react';
import { connect } from 'react-redux';

import {
  addActiveFilter,
  removeActiveFilter,
  toggleActiveFilter
} from 'store/modules/cms';

import ElementBox from 'components/light-admin/containers/ElementBox'

const FilterItem = ({ filter, active, onClick }) =>
	<div className={ `filter-item ${ active ? "active" : "" }` }
		onClick={ e => { e.stopPropagation(); onClick(filter); } }>
		{ filter }
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
			a || filters.includes(c)
		, false)
		return (
			<div className="filter-item filter-heading"
				onClick={ this.props.toggleOpened }>
				{ heading }
				{ !isActive ? null :
					<span className="os-icon os-icon-others-43 float-right"
						style={ { paddingTop: "1px", fontSize: "1.25em" } }/>
				}
				<div style={ { maxHeight: "400px", overflow: "auto" } }>
					{ !this.props.opened ? null :
						filters.sort().map(filter =>
							<FilterItem key={ filter }
								filter={ filter }
								onClick={ toggleActiveFilter }
								active={ activeFilters.includes(filter) }/>
						, this)
					}
				</div>
			</div>
		)
	}
}

class CMS_FilterPanel extends React.Component {
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
	render() {
		let {
			contentFilters,
			activeFilters
		} = this.props.cms;
		contentFilters.sort((a, b) => a.heading < b.heading ? -1 : 1);
		return (
          	<div className={ this.props.className }>
				<ElementBox>
					<h5>Filter Keys</h5>
					{
						contentFilters.map((filter, i) =>
							<FilterHeading { ...filter }
								toggleOpened={ this.toggleOpened.bind(this, i) }
								opened={ this.state.opened === i }
								key={ filter.heading }
								activeFilters={ activeFilters }
								toggleActiveFilter={ this.props.toggleActiveFilter }/>
						)
					}
				</ElementBox>
      		</div>
		)
	}
}

CMS_FilterPanel.defaultProps = {
	className: 'col-lg-3'
}

const mapStateToProps = state => ({
    user: state.user,
    router: state.router,
    cms: state.cms
})

const mapDispatchToProps = {
  addActiveFilter,
  removeActiveFilter,
  toggleActiveFilter
};

export default connect(mapStateToProps, mapDispatchToProps)(CMS_FilterPanel);
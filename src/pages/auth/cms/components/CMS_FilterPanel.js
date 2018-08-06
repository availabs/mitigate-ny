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
	state = {
		opened: false
	}
	toggleOpened() {
		const opened = !this.state.opened;
		this.setState({ opened });
	}
	render() {
		const {
			heading,
			filters,
			toggleActiveFilter,
			activeFilters
		} = this.props;
		return (
			<div className="filter-item filter-heading"
				onClick={ this.toggleOpened.bind(this) }>
				{ heading }
				<div>
					{ !this.state.opened ? null :
						filters.map(filter =>
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
						contentFilters.map(filter =>
							<FilterHeading { ...filter }
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
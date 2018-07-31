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
		onClick={ onClick.bind(null, filter) }>
		{ filter }
	</div>

class CMS_FilterPanel extends React.Component {
	render() {
		let {
			contentFilters,
			activeFilters
		} = this.props.cms;
		contentFilters.sort((a, c) => a < c ? -1 : 1);
		return (
          	<div className={ this.props.className }>
				<ElementBox>
					<h5>Filters</h5>
					{
						contentFilters.map(f => <FilterItem key={ f } onClick={ this.props.toggleActiveFilter }filter={ f } active={ activeFilters.includes(f) }/>, this)
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
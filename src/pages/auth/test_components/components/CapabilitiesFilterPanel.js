import React from 'react';
import { connect } from 'react-redux';

import {
  
} from 'store/modules/capabilities';

import ElementBox from 'components/light-admin/containers/ElementBox'

class FilterPanel extends React.Component {
	render() {
		return (
          	<div className={ this.props.className }>
				<ElementBox>
					<h5>Filters</h5>
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
    activeFilters: state.capabilities.activeFilters
})

const mapDispatchToProps = {
  
};

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
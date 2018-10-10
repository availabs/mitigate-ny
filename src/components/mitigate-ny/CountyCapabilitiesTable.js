import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

class CCTable extends React.Component {
	fetchFalcorDeps() {
		const { geoid } = this.props;
		return this.props.falcor.get(
			['geo', '36', 'counties']
		)
		.then(res => geoid ? [geoid] : res.json.geo['36'].counties)
		.then(geoids => {
				return this.props.falcor.get(
					['counties', 'capabilities', geoids, this.props.descriptions],
					['geo', geoids, 'name']
				)
		})
	}
	processData() {
		const { geoid } = this.props;
		let data = [],
			columns = ['county', ...this.props.descriptions];
		try {
			const graph = this.props.countiesGraph.capabilities,
				geoids = geoid ? [geoid] : this.props.geoGraph['36']['counties'].value;
			geoids.forEach(geoid => {
				const row = { county: this.props.geoGraph[geoid].name };
				Object.keys(graph[geoid])
					.filter(f => this.props.descriptions.includes(f))
					.forEach(f => row[f] = graph[geoid][f] ? "X" : "")
				data.push(row);
			})
		}
		catch (e) {
			data = [];
		}
		data.sort((a, b) => a.county < b.county ? -1 : 1)
		return { data, columns };
	}
	render() {
		return (
			<TableBox { ...this.processData() }/>
		)
	}
}

CCTable.defaultProps = {
	geoid: null,
	descriptions: ['Agricultural Plan', 'Capital Improvement Plan', 'College Campus Plan']
}

const mapStateToProps = state => ({
    router: state.router,
    geoGraph: state.graph.geo,
    countiesGraph: state.graph.counties
})

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CCTable))
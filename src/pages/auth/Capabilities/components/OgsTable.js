import React from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

import {
  fnum
} from 'utils/sheldusUtils'

class OgsTable extends React.Component {
	fetchFalcorDeps({ geoid, geoLevel }=this.props) {
		if (geoLevel !== 'state') {
			return this.props.falcor.get(
				['geo', geoid, geoLevel]
			)
		}
		return (geoLevel === "state" ?
			Promise.resolve([geoid]) :
			this.props.falcor.get(
				['geo', geoid, geoLevel]
			).then(response => response.json.geo[geoid][geoLevel]))
		.then(geoids => {
			return this.props.falcor.get(
				['ogs', 'byGeoid', geoids, 'length']
			)
			.then(response => {
				const graph = response.json.ogs.byGeoid;
				let max = 0;
				geoids.forEach(geoid => {
					max = Math.max(graph[geoid].length, max);
				})
				return max;
			})
			.then(max => {
				if (max === 0) return [];
				return this.props.falcor.get(
					['ogs', 'byGeoid', geoids, 'byIndex', { from: 0, to: max - 1 }, 'id']
				)
				.then(response => {
					const ids = [],
						graph = response.json.ogs.byGeoid;
					geoids.forEach(geoid => {
						const data = graph[geoid].byIndex;
						for (let i = 0; i < max; ++i) {
							if (data[i]) {
								ids.push(data[i].id)
							}
						}
					})
					return ids;
				})
			})
		})
		.then(ids => {
			if (!ids.length) return;
			return this.props.falcor.get(
				['ogs', 'byId', ids, ['desc', 'agency', 'status']]
			)
		})
	}

	processData({ geoid, geoLevel }=this.props) {
		const data = [],
			columns = ["desc", "agency", "status"],
			graph = this.props.ogs.byId;
		for (const id in graph) {
			data.push(graph[id]);
		}
		if (!data.length) throw "Loading..."
		return { data, columns }
	}

	render() {
		try {
			return (
				<TableBox { ...this.processData() }
					pageSize={ 13 }/>
			)
		}
		catch (e) {
			return (
				<ElementBox>Loading...</ElementBox>
			)
		}
	}
}

OgsTable.defaultProps = {
	geoid: "36",
	geoLevel: "state"
}

const mapStateToProps = state => ({
    router: state.router,
    ogs: state.graph.ogs,
    geo: state.graph.geo
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(OgsTable))
import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import get from "lodash.get";

import { quantile } from "d3-array"

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

import {
  getHazardName,
  ftypeMap
} from 'utils/sheldusUtils'

class CritTable extends React.Component {

	state = {
		tableData: []
	}

  	getHazardName({ hazard }=this.props) {
    	try {
      		return this.props.riskIndexGraph.meta[hazard].name;
    	}
    	catch (e) {
      		return getHazardName(hazard)
    	}
  	}

	fetchFalcorDeps({ geoid, geoLevel, hazard, highRisk } = this.props) {
		return this.props.falcor.get(
				["geo", geoid, geoLevel],
				["riskIndex", "meta", hazard, "name"]
			)
			.then(response => response.json.geo[geoid][geoLevel])
			.then(geoids => {
				if (!geoids.length) return;
				return this.props.falcor.get(
					["riskIndex", geoids, hazard, 'score']
				)
				.then(response => {
					const graph = response.json.riskIndex,
						data = [];
					geoids.forEach(geoid => {
						if (graph[geoid][hazard] === null) return;
    					const score = +graph[geoid][hazard].score;
    					data.push({ geoid, score });
					})
					const qntl = quantile(data.map(d => d.score).sort(), highRisk);
					return data.filter(d => d.score >= qntl).map(d => d.geoid);
				})
				.then(geoids => {
					return this.props.falcor.get(
						['critical', 'byGeoid', geoids, 'length']
					)
					.then(response => {
						const data = response.json.critical.byGeoid;
						let max = 0;
						geoids.forEach(geoid => {
							max = Math.max(max, data[geoid].length);
						})
						return max;
					})
					.then(max => {
						if (max === 0) return;
						return this.props.falcor.get(
							['critical', 'byGeoid', geoids, 'byIndex', { from: 0, to: max -1 }, 'id']
						)
						.then(response => {
							const data = response.json.critical.byGeoid,
								ids = [];
							geoids.forEach(geoid => {
								for (let i = 0; i < max; ++i) {
									const indices = data[geoid].byIndex;
									if (indices[i]) {
										ids.push(indices[i].id)
									}
								}
							})
							return ids;
						})
						.then(ids => this.props.falcor.get(
							['critical', 'byId', ids, ['ftype']]
						))
					})
					.then(() => this.processCriticalData())
				})
			})
	}

	processCriticalData() {
		let tableData = [];
		try {
			const graph = this.props.critical.byId,
				map = {};
			for (const id in this.props.critical.byId) {
				const ftype = graph[id].ftype;
				if (!(ftype in map)) {
					map[ftype] = 0;
				}
				const total = map[ftype] + 1;
				map[ftype] = total;
			}
			tableData = Object.keys(map).map(key =>
				({ "infrastructure type": ftypeMap[key].name, "at risk": +map[key] })
			).sort((a, b) => b["at risk"] - a["at risk"])
		}
		catch (e) {
			tableData = [];
		}
		finally {
			this.setState({ tableData });
		}
	}

	render() {
		const { tableData } = this.state;
		return (
			!tableData.length ? <ElementBox>Loading...</ElementBox> :
			<TableBox data={ tableData }
				title={ `At Risk Infrastructure for: ${ this.getHazardName() }` }/>
		)
	}
}

CritTable.defaultProps = {
	geoid: '36',
	geoLevel: "tracts",
	hazard: "riverine",
	highRisk: 0.95
}

const mapStateToProps = state => ({
  	router: state.router,
  	critical: state.graph.critical,
  	riskIndexGraph: state.graph.riskIndex
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CritTable));
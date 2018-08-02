import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { createMatchSelector } from 'react-router-redux';

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

import {
	EARLIEST_YEAR,
	LATEST_YEAR
} from "./yearsOfFemaDisasterDeclarationsData"

class FemaDisasterDeclarationsTable extends React.Component {
	fetchFalcorDeps() {
	    const { params } = createMatchSelector({ path: '/risk-index/h/:hazard' })(this.props) || { params: {} },
	     	{ hazard } = params;
	    if (!hazard) return Promise.resolve();
// `femaDisaster[{keys:geoids}][{keys:hazardids}][{integers:years}].length`
	    return this.props.falcor.get(
	    	["femaDisaster", "36", hazard, { from: EARLIEST_YEAR, to: LATEST_YEAR }, "length"]
	    )
	    .then(response => {
	    	let max = 0;
	    	const hazardData = response.json.femaDisaster["36"][hazard];
			for (let year = EARLIEST_YEAR; year <= LATEST_YEAR; ++year) {
				const length = hazardData[year].length;
				max = Math.max(max, length);
			}
			return this.props.falcor.get(
	    		["femaDisaster", "36", hazard, { from: EARLIEST_YEAR, to: LATEST_YEAR }, { from: 0, to: max -1 }, "disasternumber"]
	    	)
		    .then(response => {
				const disasternumbers = [],
					hazardData = response.json.femaDisaster["36"][hazard];
				for (let year = EARLIEST_YEAR; year <= LATEST_YEAR; ++year) {
					const yearData = hazardData[year];
					for (let index = 0; index < max; ++index) {
						const data = yearData[index];
						if (data) {
							disasternumbers.push(data.disasternumber);
						}
					}
				}
				return disasternumbers;
		    })
		    .then(disasternumbers => {
// `femaDisaster.byDisasterNumber[{integers:disasternumbers}]['${ DISASTER_ATTRIUBUTES.join("','") }']`
// 'disastername', 'declarationtype', 'geoid', 'year'
		    	return this.props.falcor.get(
		    		["femaDisaster", "byDisasterNumber", disasternumbers, ['disastername', 'declarationtype', 'year']]
		    	)
		    })
	    })
	}

	processData() {
console.log(this.props.femaDisaster)
		const graph = this.props.femaDisaster.byDisasterNumber
		return Object.keys(graph)
			.map(key => graph[key])
			// .map(key => {
			// 	let row = Object.assign({}, graph[key]);
			// 	row.date = new Date(row.date).toLocaleString();
			// 	return row;
			// })
			.sort((a, b) => b.date - a.date)
	}

	render() {
		try {
			const data = this.processData();
console.log("DATA:",data);
			return (
				<TableBox data={ data }/>
			)
		}
		catch (e) {
			return (
				<ElementBox>Loading...</ElementBox>
			)
		}
	}
}

const mapStateToProps = state => {
  return {
  	router: state.router,
  	femaDisaster: state.graph.femaDisaster
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(FemaDisasterDeclarationsTable));
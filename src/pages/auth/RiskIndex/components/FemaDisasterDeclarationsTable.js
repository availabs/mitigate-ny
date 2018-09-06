import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

import {
	EARLIEST_YEAR,
	LATEST_YEAR
} from "./yearsOfFemaDisasterDeclarationsData"

class FemaDisasterDeclarationsTable extends React.Component {
	
	fetchFalcorDeps() {
	    const { hazard, geoid } = this.props;
	    return this.props.falcor.get(
	    	['riskIndex', 'hazards']
	    )
	    .then(response => response.json.riskIndex.hazards)
	    .then(hazards => {
	    	hazards = hazard ? [hazard] : hazards;
// `femaDisaster[{keys:geoids}][{keys:hazardids}][{integers:years}].length`
		    return this.props.falcor.get(
		    	["femaDisaster", geoid, hazards, { from: EARLIEST_YEAR, to: LATEST_YEAR }, "length"]
		    )
		    .then(response => {
		    	let max = 0;
		    	hazards.forEach(hazard => {
			    	const hazardData = response.json.femaDisaster[geoid][hazard];
					for (let year = EARLIEST_YEAR; year <= LATEST_YEAR; ++year) {
						const length = hazardData[year].length;
						max = Math.max(max, length);
					}
				})
				if (!max) return;
				return this.props.falcor.get(
		    		["femaDisaster", geoid, hazards, { from: EARLIEST_YEAR, to: LATEST_YEAR }, { from: 0, to: max -1 }, "disasternumber"]
		    	)
			    .then(response => {
					const disasternumbers = [];
					hazards.forEach(hazard => {
						const hazardData = response.json.femaDisaster[geoid][hazard];
						for (let year = EARLIEST_YEAR; year <= LATEST_YEAR; ++year) {
							const yearData = hazardData[year];
							for (let index = 0; index < max; ++index) {
								const data = yearData[index];
								if (data) {
									disasternumbers.push(data.disasternumber);
								}
							}
						}
					})
					return disasternumbers;
			    })
			    .then(disasternumbers => {
			    	if (!disasternumbers.length) return;
	// `femaDisaster.byDisasterNumber[{integers:disasternumbers}]['disastername', 'declarationtype', 'geoid', 'year']`
			    	return this.props.falcor.get(
			    		["femaDisaster", "byDisasterNumber", disasternumbers, ['disasternumber', 'disastername', 'declarationtype', 'date']]
			    	)
			    })
		    })
		})
	}

	processData() {
		const graph = this.props.femaDisaster.byDisasterNumber,
			keys = {},
			data = Object.keys(graph)
				.map(key => {
					let row = Object.assign({}, graph[key]);
					Object.keys(row).forEach(k => { keys[k] = true; });
					const date = new Date(row.date);
					row.date = `${ date.getMonth() + 1 }/${ date.getDate() }/${ date.getFullYear() }`;
					row.dateValue = date.valueOf();
					return row;
				})
				.sort((a, b) => b.dateValue - a.dateValue);
		return { data, columns: Object.keys(keys) };
	}

	render() {
		try {
			return (
				<TableBox { ...this.processData() }/>
			)
		}
		catch (e) {
			return null;
		}
	}
}

FemaDisasterDeclarationsTable.defaultProps = {
	geoid: "36",
	hazard: null
}

const mapStateToProps = state => {
  return {
  	router: state.router,
  	femaDisaster: state.graph.femaDisaster
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(FemaDisasterDeclarationsTable));
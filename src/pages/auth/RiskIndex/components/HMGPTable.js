import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

import {
  fnum
} from 'utils/sheldusUtils'

class HMAP_Table extends React.Component {
	
	fetchFalcorDeps() {
	    const { geoid, geoLevel, hazard } = this.props;

	    return this.props.falcor.get(
	    	["hmap", "yearsOfData"],
	    	['riskIndex', 'hazards']
	    )
	    .then(response => [response.json.hmap.yearsOfData, response.json.riskIndex.hazards])
	    .then(([years, hazards]) => {
// `hmap[{keys:geoids}][{keys:hazardids}][{integers:years}].length`
			hazards = hazard ? [hazard] : hazards;
// console.log("hazards:",hazards);
	    	return this.props.falcor.get(
	    		['hmap', geoid, hazards, years, 'length']
	    	)
	    	.then(response => {
	    		let max = 0;
	    		hazards.forEach(hazard => {
		    		const data = response.json.hmap[geoid][hazard];
		    		years.forEach(year => {
		    			max = Math.max(max, data[year].length)
		    		})
		    	})
	    		return max;
	    	})
	    	.then(max => {
// console.log("max:",max);
	    		if (!max) return;
// 'hmap[{keys:geoids}][{keys:hazardids}][{integers:years}].byIndex[{integers:indices}].project_id'
	    		return this.props.falcor.get(
	    			['hmap', geoid, hazards, years, 'byIndex', { from: 0, to: max - 1 }, 'project_id']
	    		)
		    	.then(response => {
		    		const project_ids = [];
		    		hazards.forEach(hazard => {
		    			const data = response.json.hmap[geoid][hazard];
			    		years.forEach(year => {
			    			for (let i = 0; i < max; ++i) {
			    				if (data[year].byIndex[i]) {
			    					project_ids.push(data[year].byIndex[i].project_id)
			    				}
				    		}
			    		})
			    	})
		    		return project_ids;
		    	})
	    	})
	    })
	    .then(project_ids => {
// console.log("project_ids:",project_ids)
	    	if (!project_ids || project_ids.length === 0) return;
	    	return this.props.falcor.get(
	    		['hmap', 'byId', project_ids,
	    			[
				  		"year",
				  		"county",
				  		"subgrantee",
				  		"projecttype",
				  		"projectamount"
				  	]
				]
	    	)
	    })
	}

	createRow(data) {
		const row = {};
		row["year"] = data.year;
		row["project amount"] = fnum(data.projectamount);
		row["county"] = data.county;
		row["subgrantee"] = data.subgrantee;
		row["project type"] = data.projecttype;
		row["value"] = data.projectamount;
		return row;
	}

	processData() {
		const graph = this.props.hmap.byId,
			data = Object.keys(graph)
				.map(key => this.createRow(graph[key]))
				.sort((a, b) => b.value - a.value);
		if (!data.length) throw new Error("No Data.");
		return { data, columns: Object.keys(data[0]).filter(d => d !== "value") };
	}

	render() {
		try {
			return (
				<TableBox { ...this.processData() }
					filterKey="year"/>
			)
		}
		catch (e) {
			return null;
		}
	}
}

HMAP_Table.defaultProps = {
	geoid: '36',
	geoLevel: 'state',
	hazard: null
}

const mapStateToProps = state => {
  return {
  	router: state.router,
  	hmap: state.graph.hmap
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HMAP_Table));
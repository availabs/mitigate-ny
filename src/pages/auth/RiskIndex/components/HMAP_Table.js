import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { format as d3format } from "d3-format"

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

class HMAP_Table extends React.Component {
	
	fetchFalcorDeps() {
	    const { geoid, geoLevel, hazard } = this.props;
	    if (!hazard) return Promise.resolve();

	    return this.props.falcor.get(
	    	["hmap", "yearsOfData"]
	    )
	    .then(response => response.json.hmap.yearsOfData)
	    .then(years => {
// `hmap[{keys:geoids}][{keys:hazardids}][{integers:years}].length`
	    	return this.props.falcor.get(
	    		['hmap', geoid, hazard, years, 'length']
	    	)
	    	.then(response => {
	    		let max = 0;
	    		const data = response.json.hmap[geoid][hazard];
	    		years.forEach(year => {
	    			max = Math.max(max, data[year].length)
	    		})
	    		return max;
	    	})
	    	.then(max => {
// 'hmap[{keys:geoids}][{keys:hazardids}][{integers:years}].byIndex[{integers:indices}].project_id'
	    		return this.props.falcor.get(
	    			['hmap', geoid, hazard, years, 'byIndex', { from: 0, to: max - 1 }, 'project_id']
	    		)
		    	.then(response => {
		    		const data = response.json.hmap[geoid][hazard],
		    			project_ids = [];
		    		years.forEach(year => {
		    			for (let i = 0; i < max; ++i) {
		    				if (data[year].byIndex[i]) {
		    					project_ids.push(data[year].byIndex[i].project_id)
		    				}
			    		}
		    		})
		    		return project_ids;
		    	})
	    	})
	    })
	    .then(project_ids =>
	    	this.props.falcor.get(
	    		['hmap', 'byId', project_ids,
	    			[
				  		"year",
				  		"projecttype",
				  		"projectamount"
				  	]
				]
	    	)
	    )
	}

	createRow(data, format) {
		const row = {};
		row["year"] = data.year;
		row["project amount"] = format(data.projectamount);
		row["value"] = data.projectamount;
		row["project type"] = data.projecttype;
		return row;
	}

	processData() {
		const format = d3format("$,d"),
			graph = this.props.hmap.byId,
			data = Object.keys(graph)
				.map(key => this.createRow(graph[key], format))
				.sort((a, b) => b.value - a.value);
		return { data, keys: Object.keys(data[0]).filter(d => d !== "value") };
	}

	render() {
		try {
			const { data, keys } = this.processData();
			return (
				<TableBox data={ data } columns={ keys }
					filterKey="year"/>
			)
		}
		catch (e) {
			return (
				<ElementBox>Loading...</ElementBox>
			)
		}
	}
}

HMAP_Table.defaultProps = {
	geoid: '36',
	geoLevel: 'state',
	hazard: 'hurricane'
}

const mapStateToProps = state => {
  return {
  	router: state.router,
  	hmap: state.graph.hmap
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HMAP_Table));
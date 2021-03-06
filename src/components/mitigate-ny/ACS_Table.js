import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

import * as d3format from "d3-format"

import {
	EARLIEST_YEAR,
	LATEST_YEAR,
  YEARS_OF_ACS_DATA
} from "./yearsOfAcsData";

class ACS_Table extends React.Component {

	fetchFalcorDeps() {
		const { geoid, geoLevel, variable } = this.props;
		return this.props.falcor.get(
			['geo', geoid, geoLevel]
		)
		.then(res => res.json.geo[geoid][geoLevel])
		.then(geoids => {
			const requests = [],
				skip = 500;
			for (let i = 0; i < geoids.length; i += skip) {
				requests.push(geoids.slice(i, i + skip));
			}
			return requests.reduce((a, c) => a.then(() => this.props.falcor.get(['geo', c, [LATEST_YEAR, LATEST_YEAR - 5], variable], ['geo', c, 'name'])), Promise.resolve())
		})
	}

	processData() {
		const { geoid, geoLevel, variable } = this.props,
			year = LATEST_YEAR,
			year_minus_5 = LATEST_YEAR - 5;

		let data = [];
		try {
			const geoids = this.props.geoGraph[geoid][geoLevel].value;
			geoids.forEach(g => {
				const dL = this.props.geoGraph[g][year][variable],
					d5 = this.props.geoGraph[g][year_minus_5][variable],
					name = this.props.geoGraph[g].name,
					row = {
						[geoLevel]: name,
						[year]: dL,
						[year_minus_5]: d5,
						change: dL - d5,
						percent: ((dL - d5) / d5) * 100
					};
				data.push(row);
			})
		}
		catch (e) {
			data = [];
		}
		return { data, columns: [geoLevel, year_minus_5, year, 'change', 'percent'] }
	}

	render() {
		const format = d3format.format(".1f");
		return (
			<TableBox { ...this.processData() }
				filterKey={ this.props.geoLevel }
				columnFormats={ {
					[LATEST_YEAR]: ",d",
					[LATEST_YEAR - 5]: ",d",
					change: ",d",
					percent: d => format(d) + "%"
				} }
				tableScroll={ this.props.tableScroll }
				tableLink={ this.props.tableLink }
				tableLinkLabel={ this.props.tableLinkLabel }
				downloadedFileName={ this.props.downloadedFileName }
				pageSize={ this.props.pageSize }/>
		)
	}

}

ACS_Table.defaultProps = {
	geoid: '36',
	geoLevel: 'counties',
	variable: 'population',
	tableScroll: false,
	tableLink: null,
	tableLinkLabel: "Link",
	downloadedFileName: 'acs-data',
	pageSize: 13
}

const mapStateToProps = state => ({
    router: state.router,
    geoGraph: state.graph.geo
})

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ACS_Table))
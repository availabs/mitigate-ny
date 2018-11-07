import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { fnum } from "utils/sheldusUtils"

import get from "lodash.get";

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

class NfipTable extends React.Component {

	fetchFalcorDeps({ geoid, geoLevel }=this.props) {
		return this.props.falcor.get(
			["geo", geoid, [geoLevel, 'name']],
		)
		.then(response => response.json.geo[geoid][geoLevel])
		.then(geoids => {
			return this.props.falcor.get(
				['nfip', 'losses', 'byGeoid', geoids, 'allTime', ['total_losses', 'closed_losses', 'open_losses', 'cwop_losses', 'total_payments']],
				['geo', geoids, 'name']
			)
		})
	}

	processData() {
		const { geoid, geoLevel } = this.props,
			label = geoLevel === 'counties' ? 'county' : 'county sub. div.',
			geoids = this.props.geoGraph[geoid][geoLevel].value,
			data = [];

		geoids.forEach(geoid => {
			const graph = this.props.nfip.losses.byGeoid[geoid].allTime,
				name = this.props.geoGraph[geoid].name;

			data.push({
				[label]: name,
				"total losses": graph.total_losses,
				"closed losses": graph.closed_losses,
				"open losses": graph.open_losses,
				"cwop losses": graph.cwop_losses,
				"total payments": graph.total_payments
			})
		})
		return {
			data: data.sort((a, b) => b["total payments"] - a["total payments"]),
			columns: [label, "total losses", "closed losses", "open losses", "cwop losses", "total payments"]
		};
	}

// //
	render() {
		try {
			return (
				<TableBox { ...this.processData() }
					pageSize={ 8 }
					title={ this.props.title }
					columnFormats= { {
						"total losses": ",d",
						"closed losses": ",d",
						"open losses": ",d",
						"cwop losses": ",d",
						"total payments": fnum
					} }/>
			)
		}
		catch (e) {
			return <ElementBox>Loading...</ElementBox>;
		}
	}
}

// //
NfipTable.defaultProps = {
	geoid: '36',
	geoLevel: 'cousubs',
	title: "NFIP Losses"
}

const mapStateToProps = state => ({
  	router: state.router,
    geoGraph: state.graph.geo,
    nfip: state.graph.nfip

})

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NfipTable));
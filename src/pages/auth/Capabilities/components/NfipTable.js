import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import { falcorChunkerNice } from "store/falcorGraph"

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
			return falcorChunkerNice(['nfip', 'byGeoid', geoids, 'allTime', ['num_losses', 'total_loss', 'num_properties', 'num_mitigated']])
				.then(() => falcorChunkerNice(['geo', geoids, 'name']))
		})
	}

	processData() {
		const { geoid, geoLevel } = this.props,
			label = geoLevel === 'counties' ? 'county' : 'county sub. div.',
			geoids = this.props.geoGraph[geoid][geoLevel].value,
			data = [];

// console.log(this.props.nfip)
		geoids.forEach(geoid => {
			const graph = this.props.nfip.byGeoid[geoid].allTime,
				name = this.props.geoGraph[geoid].name;

			data.push({
				[label]: name,
				"num losses": graph.num_losses,
				"num properties": graph.num_properties,
				"num mitigated": graph.num_mitigated,
				"percent mitigated": graph.num_mitigated / graph.num_properties,
				"total paid out": fnum(graph.total_loss),
				sort: graph.total_loss
			})
		})
		return {
			data: data.filter(d => d.sort).sort((a, b) => b.sort - a.sort),
			columns: [label, "num losses", "num properties", "num mitigated", "total paid out"]
		};
	}

// //
	render() {
		const { geoid, geoLevel } = this.props;
		try {
			const name = this.props.geoGraph[geoid].name;
			return (
				<TableBox { ...this.processData() }
					pageSize={ 8 }
					title={ "NFIP Repetitive Loss Properties and Losses " + (geoLevel === 'counties' ? "By County" : "For " + name) }
					columnFormats= { {
						"num losses": ",d",
						"num properties": ",d",
						"num mitigated": ",d",
						"percent mitigated": ".2%"
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
	geoLevel: 'counties'
}

const mapStateToProps = state => ({
  	router: state.router,
    geoGraph: state.graph.geo,
    nfip: state.graph.nfip
})

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(NfipTable));

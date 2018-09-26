import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import get from "lodash.get";

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

import {
  	ATTRIBUTES,
  	receiveCapabilities,
  	receiveHazards,
  	getLabel
} from "store/modules/capabilities"

import { fnum } from "utils/sheldusUtils"

class HighRiskMunicipalities extends React.Component {

	fetchFalcorDeps({ hazard }=this.props) {
    	return this.props.falcor.get(
      		['severeWeather', 'highRisk', hazard]
    	)
    	.then(response => {
      		const data = response.json.severeWeather.highRisk[hazard],
      			geoids = data.map(d => d.geoid);
      		return this.props.falcor.get(
      			['geo', geoids, 'name']
      		)
    	})
	}

	processData() {
		const data = [],
			{ hazard } = this.props;
		try {
			const values = this.props.severeWeather.highRisk[hazard].value,
				geo = this.props.geoGraph;
			values.forEach(v => {
				data.push({
					geoid: v.geoid,
					annualized_damage: fnum(v.annualized_damage),
					name: geo[v.geoid].name
				})
			})
		}
		catch (e) {
			
		}
		return data;
	}

	render() {
		return (
			<div>
				{ 
					this.processData().map(d =>
						<h6 key={ d.geoid }>
							<span>{ d.name }</span>
							<span className="float-right">{ d.annualized_damage }</span>
						</h6>
					)
				}
			</div>
		)
	}
}

HighRiskMunicipalities.defaultProps = {
	hazard: 'riverine'
}

const mapStateToProps = state => ({
    router: state.router,
    severeWeather: state.graph.severeWeather,
    geoGraph: state.graph.geo
})

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HighRiskMunicipalities))
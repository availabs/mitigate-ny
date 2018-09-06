import React from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'

import { format } from "d3-format"

import {
  getHazardName
} from 'utils/sheldusUtils'

import SideInfoProjectBox from "./SideInfoProjectBox"

const FORMAT = format("$,.0f");

class CountyHeroStats extends React.Component {
	fetchFalcorDeps({ dataType, geoid }=this.props) {
		return this.props.falcor.get(
			['riskIndex', 'hazards']
		)
		.then(response => response.json.riskIndex.hazards)
		.then(hazards =>
			this.props.falcor.get(
				['riskIndex', 'meta', hazards, 'name'],
				[dataType, geoid, hazards, 'allTime', 'annualized_damage']
			)
		)
	}

  	getHazardName(hazard) {
    	try {
      		return this.props.riskIndex.meta[hazard].name;
    	}
    	catch (e) {
      		return getHazardName(hazard)
    	}
  	}

	processData() {
		const { dataType, geoid } = this.props;
		let data = [];
		try {
			for (const hazard in this.props[dataType][geoid]) {
				const value = +this.props[dataType][geoid][hazard].allTime.annualized_damage;
				if (value) {
					data.push({
						label: this.getHazardName(hazard),
						value: FORMAT(value),
						sort: value
					})
				}
			}
		}
		catch (e) {
			data = [];
		}
		finally {
			return data.sort((a, b) => b.sort - a.sort);
		}
	}

	render() {
		const rows = this.processData();
		return (
			<SideInfoProjectBox rows={ rows }
				title="Annualized Damages"/>
		)
	}
}

CountyHeroStats.defaultProps = {
	dataType: "severeWeather"
}

const mapStateToProps = state => ({
    riskIndex: state.graph.riskIndex,
    router: state.router,
    severeWeather: state.graph.severeWeather
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CountyHeroStats))
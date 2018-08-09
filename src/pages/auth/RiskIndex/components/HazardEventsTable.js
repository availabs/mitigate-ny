import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import { createMatchSelector } from 'react-router-redux';

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

import {
	EARLIEST_YEAR,
	LATEST_YEAR
} from "./yearsOfSevereWeatherData"

class HazardEventsTable extends React.Component {

	state = {
		year: LATEST_YEAR
	}

	// componentDidUpdate(oldProps, oldState) {
	// 	if (oldState.year != this.state.year) {
	// 		this.fetchFalcorDeps();
	// 	}
	// }
	
	fetchFalcorDeps() {
	    const { hazard } = this.props;
		return (hazard ? Promise.resolve([hazard]) :
			this.props.falcor.get(
		    	['riskIndex', 'hazards']
		    )
		    .then(response => {
		    	return response.json.riskIndex.hazards;
		    }))
	    	.then(hazardids => {
// 'severeWeather.events[{keys:geoids}][{keys:hazardids}][{integers:years}].length'
			return this.props.falcor.get(
				[this.props.dataType, "events", this.props.geoid, hazardids, { from: EARLIEST_YEAR, to: LATEST_YEAR }, "length"]
			)
		    .then(response => {
		    	let max = 0;
		    	const graph = response.json[this.props.dataType].events[this.props.geoid];
		    	hazardids.forEach(hazardid => {
		    		for (let year = EARLIEST_YEAR; year <= LATEST_YEAR; ++year) {
		    			max = Math.max(max, +graph[hazardid][year].length);
		    		}
		    	})
		    	return max;
		    })
			.then(max => {
				if (!max) return;
// 'severeWeather.events[{keys:geoids}][{keys:hazardids}][{integers:years}][{integers:indices}].event_id'
		    	return this.props.falcor.get(
					[this.props.dataType, "events", this.props.geoid, hazardids, { from: EARLIEST_YEAR, to: LATEST_YEAR }, "byIndex", { from: 0, to: max - 1 }, "event_id"]
				)
				.then(response => {
					const event_ids = {},
						graph = response.json[this.props.dataType].events[this.props.geoid];

					hazardids.forEach(hazardid => {
						if (!(hazardid in event_ids)) {
							event_ids[hazardid] = {};
						}
						for (let year = EARLIEST_YEAR; year <= LATEST_YEAR; ++year) {
							if (!(year in event_ids[hazardid])) {
								event_ids[hazardid][year] = [];
							}
			    			for (let index = 0; index < max; ++index) {
			    				const data = graph[hazardid][year].byIndex[index];
			    				if (data) {
			    					event_ids[hazardid][year].push(data.event_id);
			    				}
			    			}
			    		}
			    	})
					return event_ids;
				})
			})
	    })
	    .then(event_ids => {
	    	const requests = [];
	    	for (const hazardid in event_ids) {
	    		for (const year in event_ids[hazardid]) {
	    			if (event_ids[hazardid][year].length) {
	    				requests.push({
	    					year: +year,
	    					request: [
								this.props.dataType,
								"events", "byId",
								event_ids[hazardid][year],
								[
									'geoid', 'cousub_geoid', 'year',
									'property_damage',
									'episode_narrative', 'episode_id',
									'event_narrative', 'event_id'
								]
							]
    					})
	    			}
	    		}
	    	}
	    	return requests.sort((a, b) => b.year - a.year)
		    	.reduce((a, c) =>
		    		a.then(() => this.props.falcor.get(c.request))
		    	, Promise.resolve());
	    })
	}

	processData() {
	    const { hazard } = this.props,

	     	hazardids = hazard ? [hazard] : this.props.riskIndex.hazards,

			event_ids = [],

			graphEventsByGeoid = this.props[this.props.dataType].events[this.props.geoid],
			graphEventsById = this.props[this.props.dataType].events.byId,

			data = [];

		hazardids.forEach(hazardid => {
			const length = graphEventsByGeoid[hazardid][this.state.year].length,
				byIndex = graphEventsByGeoid[hazardid][this.state.year].byIndex;
			for (let index = 0; index < length; ++index) {
				event_ids.push(byIndex[index].event_id);
			}
		})
		event_ids.forEach(event_id => {
			const {
				property_damage,
				event_narrative,
				episode_narrative
			} = graphEventsById[event_id];
			data.push({
				"property damage": "$" + (+property_damage).toLocaleString('en'),
				property_damage: +property_damage,
				narrative: event_narrative || episode_narrative
			})
		})
		data.sort((a, b) => b.property_damage - a.property_damage);
		return { data, columns: ['property damage', 'narrative'] };
	}

	render() {
		try {
			return (
				<TableBox { ...this.processData() }
					filterKey="narrative"
					pageSize={ 8 }/>
			)
		}
		catch (e) {
			return (
				<ElementBox>Loading...</ElementBox>
			)
		}
	}
}

HazardEventsTable.defaultProps = {
	dataType: "severeWeather",
	geoid: "36"
}

const mapStateToProps = state => {
  	return {
	  	router: state.router,
	  	riskIndex: state.graph.riskIndex,
	  	severeWeather: state.graph.severeWeather
  	};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardEventsTable));
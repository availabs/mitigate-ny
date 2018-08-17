import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import ElementBox from 'components/light-admin/containers/ElementBox'
import TableBox from 'components/light-admin/tables/TableBox'

import { fnum } from 'utils/sheldusUtils'

import {
	EARLIEST_YEAR,
	LATEST_YEAR
} from "./yearsOfSevereWeatherData"

class HazardEventsTable extends React.Component {
	
	fetchFalcorDeps() {
	    const { hazard, year } = this.props;
		return (hazard ? Promise.resolve([hazard]) :
		this.props.falcor.get(
	    	['riskIndex', 'hazards']
	    )
	    .then(response => {
	    	return response.json.riskIndex.hazards;
	    }))
    	.then(hazardids => {
// console.log("hazardids",hazardids)
// 'severeWeather.events[{keys:geoids}][{keys:hazardids}][{integers:years}].length'
			return this.props.falcor.get(
				[this.props.dataType, "events", this.props.geoid, hazardids, year, "length"]
			)
		    .then(response => {
		    	let max = 0;
		    	hazardids.forEach(hazardid => {
		    		const length = +response.json[this.props.dataType].events[this.props.geoid][hazardid][year].length;
		    		max = Math.max(max, length);
		    	})
		    	return max;
		    })
			.then(max => {
				if (!max) return;
// 'severeWeather.events[{keys:geoids}][{keys:hazardids}][{integers:years}][{integers:indices}].event_id'
		    	return this.props.falcor.get(
					[this.props.dataType, "events", this.props.geoid, hazardids, year, "byIndex", { from: 0, to: max - 1 }, "event_id"]
				)
				.then(response => {
					const event_ids = [],
						graph = response.json[this.props.dataType].events[this.props.geoid];

					hazardids.forEach(hazardid => {
		    			for (let index = 0; index < max; ++index) {
		    				const data = graph[hazardid][year].byIndex[index];
		    				if (data) {
		    					event_ids.push(data.event_id);
		    				}
		    			}
			    	})
					return event_ids;
				})
			})
	    })
	    .then(event_ids => {
// console.log("event_ids",event_ids.length)
	    	const requests = [],
	    		eventIdsPerRequest = 500;
	    	for (let i = 0; i < event_ids.length; i += eventIdsPerRequest) {
				requests.push([
					this.props.dataType,
					"events", "byId",
					event_ids.slice(i , i + eventIdsPerRequest),
					[
						'property_damage',
						'episode_narrative', 'episode_id',
						'event_narrative', 'event_id',
						'municipality', 'county', 'date'
					]
				])
			}
	    	return requests.sort((a, b) => b.year - a.year)
		    	.reduce((a, c) =>
		    		a.then(() => this.props.falcor.get(c))
		    	, Promise.resolve());
	    })
	}

	processData() {
	    const { hazard, dataType, geoid, year } = this.props,

	     	hazardids = hazard ? [hazard] : this.props.riskIndex.hazards,

			event_ids = [],

			graphEventsByGeoid = this.props[dataType].events[geoid],
			graphEventsById = this.props[dataType].events.byId,

			data = [];

		hazardids.forEach(hazardid => {
			const length = graphEventsByGeoid[hazardid][year].length,
				byIndex = graphEventsByGeoid[hazardid][year].byIndex;
			for (let index = 0; index < length; ++index) {
				event_ids.push(byIndex[index].event_id);
			}
		})
		event_ids.forEach(event_id => {
			const {
				property_damage,
				event_narrative,
				episode_narrative,
				municipality,
				county,
				date
			} = graphEventsById[event_id];
console.log("DATE:",date)
			data.push({
				"property damage": fnum(+property_damage),
				property_damage: +property_damage,
				"municipality": municipality ? `${ municipality }, ${ county }` : county,
				"date": new Date(date).toLocaleString(),
				"narrative": event_narrative || episode_narrative
			})
		})
		data.sort((a, b) => b.property_damage - a.property_damage);
		return { data, columns: ['property damage', "municipality", "date", 'narrative'] };
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
// console.log(e)
			return (
				<ElementBox>Loading...</ElementBox>
			)
		}
	}
}

HazardEventsTable.defaultProps = {
	dataType: "severeWeather",
	geoid: "36",
	year: 2017
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
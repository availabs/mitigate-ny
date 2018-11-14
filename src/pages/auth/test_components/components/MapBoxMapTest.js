import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import MapBoxMap from "components/mapping/escmap/MapBoxMap.react"

class TestMap extends React.Component {
	render() {
		return (
			<MapBoxMap
		)
	}
}

TestMap.defaultProps = {
  geoid: '36',
  hazard: 'riverine',
  threeD: true,
  standardScale: true
}

const mapStateToProps = state => ({
    riskIndex: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeWeather: state.graph.severeWeather || {},
    router: state.router
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(TestMap))
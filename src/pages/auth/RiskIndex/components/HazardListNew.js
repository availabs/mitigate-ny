import React from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'

import { Link } from "react-router-dom"

import get from 'lodash.get'

import ElementBox from 'components/light-admin/containers/ElementBox'

import HazardListHeroStats from "./HazardListHeroStats"
import HazardMap from "./HazardMap"

import "./HazardList.css"

const ListItem = ({ hazard, name, onClick, active }) =>
	<div className={ "hazard-list-item" + (active ? " active" : "") }
		onClick={ onClick }
		key={ hazard }>
		{ name }
		<span className="float-right">
			<Link to={ `hazards/${ hazard }` }
				className="hazard-link">
				view...
			</Link>
		</span>
	</div>

class HazardList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			hazard: props.hazard,
			geoid: props.geoid
		}
	}

	fetchFalcorDeps() {
		return this.props.falcor.get(
			['riskIndex', 'hazards']
		)
		.then(response => response.json.riskIndex.hazards)
		.then(hazards => this.props.falcor.get(
			['riskIndex', 'meta', hazards, 'name']
		))
	}

	selectHazard(hazard) {
		this.setState({ hazard });
	}

	renderHazardSelector() {
		try {
			return this.props.riskIndex.hazards.value
				.sort().map(hazard => {
					const name = this.props.riskIndex.meta[hazard].name
					return (
						<ListItem onClick={ this.selectHazard.bind(this, hazard) }
							key={ hazard }
							hazard={ hazard }
							name={ name }
							active={ hazard === this.state.hazard }/>
					)
				})
		}
		catch (e) {
			return "Loading..."
		}
	}

	render() {
		return (
			<div className="row">

				<div className="col-4"
					style={ { height: "500px" } }>
					<ElementBox>
						{ this.renderHazardSelector() }
					</ElementBox>
				</div>


				<div className="col-8">
					<div className="row">
						<div className="col-12">
							<ElementBox>
								<HazardListHeroStats
									{ ...this.state }/>
							</ElementBox>
						</div>
					</div>

					<div className="row">
						<div className="col-12">
							<ElementBox>
								<HazardMap height={ 600 }
									{ ...this.state }/>
							</ElementBox>
						</div>
					</div>
				</div>

			</div>
		)
	}
}

HazardList.defaultProps = {
  geoid: 36,
  hazard: 'riverine'
}

const mapStateToProps = state => ({
    riskIndex: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeWeather: state.graph.severeWeather || {},
    router: state.router
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(HazardList))
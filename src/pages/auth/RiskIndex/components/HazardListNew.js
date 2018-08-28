import React from 'react'
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'

import { Link } from "react-router-dom"

import get from 'lodash.get'

import ElementBox from 'components/light-admin/containers/ElementBox'

import HazardListHeroStats from "./HazardListHeroStats"
import HazardMap from "./HazardMap"
import HazardEventsMapController from "./HazardEventsMapController"

import "./HazardList.css"

// <i class="os-icon os-icon-phone-21"></i>
			
const ListItem = ({ hazard, name, onClick, active }) =>
	<li className={ active ? " active" : "" }
		key={ hazard }>
		<a onClick={ onClick }>
			<i className="os-icon os-icon-arrow-right2"></i>
			<span>{ name } </span>
		</a>
		
	</li>

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
			<div className="row m-0">

				<div className="col-2"
					style={ { minHeight: "500px" } }>
					<div className='ae-side-menu'>
						<ul className='ae-main-menu'>
						{ this.renderHazardSelector() }
						</ul>
					</div>
				</div>


				<div className="col-10">
					<div className="row">
						<div className="col-12">
							<ElementBox>
								<HazardListHeroStats
									{ ...this.state }/>
							</ElementBox>
						</div>
					</div>

					<HazardEventsMapController height={ 600 }
						mapHeight={ 600 }
						{ ...this.state }/>

				</div>

			</div>
		)
	}
}

HazardList.defaultProps = {
  geoid: '36',
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
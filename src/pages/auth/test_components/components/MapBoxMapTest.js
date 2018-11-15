import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import * as d3scale from 'd3-scale'

import MapBoxMap from "components/mapping/escmap/MapBoxMap.react"

import {
  getHazardName,
  ftypeMap,
  fnum
} from 'utils/sheldusUtils'

class TestMap extends React.Component {

  state = {
    fillColor: null,
    hoverData: null,
    scores: {},
    scale: d3scale.scaleThreshold()
      .domain([50000, 500000, 5000000, 10000000])
      .range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"])
  }

  fetchFalcorDeps({ geoid, geoLevel, hazard } = this.props) {
    return this.props.falcor.get(
      ['geo', geoid, ['tracts', 'counties']],
      ['riskIndex', 'meta', hazard, 'name']
    )
    .then(res => res.json.geo[geoid][geoLevel])
    .then(geoids => this.props.falcor.get(
      ['severeWeather', geoids, hazard, 'tract_totals', 'total_damage']
    ))
    .then(() => this.processData())
  }

  processData({ geoid, geoLevel, hazard } = this.props) {
    let scale = d3scale.scaleThreshold()
      .domain(this.props.thresholds)
      .range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"])
    try {
      const geoids = this.props.geoGraph['36'][geoLevel].value,
        fillColor = {},
        scores = {};

      geoids.forEach(geoid => {
        const score = +this.props.severeWeather[geoid][hazard].tract_totals.total_damage;
        fillColor[geoid] = scale(score);
        scores[geoid] = score;
      })

      this.setState({ fillColor, scores })
    }
    catch (e) {
      this.setState({ fillColor: null, scores: {}, scale });
      return;
    }
  }

  createLayers({ geoid, geoLevel, hazard } = this.props) {
    const { fillColor, scores } = this.state;

    let counties = [],
      geoids = [];
    try {
      counties = this.props.geoGraph['36']['counties'].value;
      geoids = this.props.geoGraph['36'][geoLevel].value;
    }
    catch (e) {
      counties = [];
      geoids = [];
    }
    return [
      { id: 'states-fill',
        geoLevel: 'states',
        type: 'fill',
        'fill-color': "#f2efe9",
        geoids: ['36']
      },

      { id: 'data-layer',
        geoLevel,
        type: 'fill',
        geoids,
        'fill-color': fillColor,
        onHover: e => {
          const { features, x, y } = e;
          let hoverData = null;
          try {
            if (features && features.length) {
              hoverData = {
                rows: [
                  ["Total Loss", fnum(this.state.scores[features[0].properties.geoid])]
                ],
                x, y
              }
            }
          }
          catch (e) {
            hoverData = null;
          }
          this.setState({ hoverData })
        }
      },

      { id: 'counties-line',
        geoLevel: 'counties',
        type: 'line',
        'line-color': "#c8c8c8",
        'line-width': 1,
        geoids: counties
      },
      { id: 'states-line',
        geoLevel: 'states',
        type: 'line',
        'line-color': "#fff",
        'line-width': 2,
        geoids: ['36']
      }
    ]
  }

  generateLegend() {
    const { scale } = this.state,
      { hazard } = this.props,
      name = this.getHazardName(hazard),
      range = scale.range(),
      width = `${ 100 / range.length }%`;
    return (
      <table className="map-test-table">
        <thead>
          <tr>
            <th className="no-border-bottom" colSpan={ range.length }>
              { "Total Loss" }
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {
              range.map(t => <td key={ t } style={ { width, height: '10px', background: t } }/>)
            }
          </tr>
          <tr>
            {
              range.map(t => {
                const value = +(scale.invertExtent(t)[0] || 0).toFixed(2)
                return <td key={ t } style={ { width } }>{ fnum(value) }</td>
              })
            }
          </tr>
        </tbody>
      </table>
    )
  }
  generateControls() {
    const controls = [];

    controls.push({
      pos: "top-left",
      comp: this.generateLegend()
    })

    return controls;
  }

  getHazardName(hazard) {
    try {
        return this.props.riskIndex.meta[hazard].name;
    }
    catch (e) {
        return hazard
    }
  }

	render() {
		return (
			<MapBoxMap
        layers={ this.createLayers() }
        controls={ this.generateControls() }
        hoverData={ this.state.hoverData }/>
		)
	}
}

TestMap.defaultProps = {
  geoid: '36',
  geoLevel: 'tracts',
  hazard: 'riverine',
  threeD: true,
  standardScale: true,
  thresholds: [50000, 500000, 5000000, 10000000]
}

const mapStateToProps = state => ({
    riskIndex: state.graph.riskIndex || {},
    sheldus: state.graph.sheldus || {},
    severeWeather: state.graph.severeWeather || {},
    router: state.router,
    geoGraph: state.graph.geo
})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(TestMap))
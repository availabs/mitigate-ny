import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import * as d3scale from 'd3-scale'

import MapBoxMap from "components/mapping/escmap/MapBoxMap.react"

import {
  getHazardName,
  ftypeMap,
  fnum,
  scaleCk
} from 'utils/sheldusUtils'

class TestMap extends React.Component {

  state = {
    fillColor: null,
    hoverData: null,
    scores: {},
    scale: d3scale.scaleQuantile()
      .range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"])
  }

  componentDidUpdate(oldProps) {
    if (oldProps.index !== this.props.index) {
      this.fetchFalcorDeps()
    }
  }

  fetchFalcorDeps({ geoid, geoLevel, index } = this.props) {
    return this.props.falcor.get(
      ['geo', geoid, ['tracts', 'counties']]
    )
    .then(res => res.json.geo[geoid][geoLevel])
    .then(geoids => this.props.falcor.get(
      ["riskIndex", geoids, index, 'score']
    ))
    .then(() => this.processData())
  }

  processData({ geoid, geoLevel, index } = this.props) {
    let scale = d3scale.scaleQuantile()
          .range(["#f2efe9", "#fadaa6", "#f7c475", "#f09a10", "#cf4010"])
    try {
      const geoids = this.props.geoGraph['36'][geoLevel].value,
        fillColor = {},
        scores = {};

      let domain = [],
        min = Infinity,
        max = -Infinity;

      const graph = this.props.riskIndex;
      geoids.forEach(geoid => {
        
        if (!graph[geoid][index]) {
          fillColor[geoid] = '#f2efe9'
          return;
        };
        const score = +this.props.riskIndex[geoid][index].score;
        scores[geoid] = score;
        domain.push(score);
        min = Math.min(min, score);
        max = Math.max(max, score);
      })
      domain.sort((a, b) => a - b);
      scale.domain(domain);

      for (const geoid in scores) {
        fillColor[geoid] = scale(scores[geoid]);
      }

      this.setState({ fillColor, scores, scale })
    }
    catch (e) {
      this.setState({ fillColor: null, scores: {}, scale });
      return;
    }
  }

  createLayers({ geoid, geoLevel, index } = this.props) {
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
        type: 'fill',
        geoLevel: 'states',
        geoids: ['36'],
        'fill-color': "#f2efe9"
      },

      { id: 'data-layer',
        type: 'fill',
        geoLevel,
        geoids,
        'fill-color': fillColor,
        autoHighlight: true,
        onHover: e => {
          const { object, x, y } = e;
          let hoverData = null;
          if (object) {
            hoverData = {
              rows: [
                ["Total Loss", fnum(this.state.scores[object.properties.geoid])]
              ],
              x, y
            }
          }
          this.setState({ hoverData })
        }
      },

      { id: 'counties-line',
        type: 'line',
        geoLevel: 'counties',
        geoids: counties,
        'line-color': "#c8c8c8",
        'line-width': 1
      },
      { id: 'states-line',
        type: 'line',
        geoLevel: 'states',
        geoids: ['36'],
        'line-color': "#fff",
        'line-width': 2
      }
    ]
  }

  generateLegend() {
    const { scale } = this.state,
      { index } = this.props,
      range = scale.range();
    return (
      <table className="map-test-table">
        <thead>
          <tr>
            <th className="no-border-bottom" colSpan={ range.length }>
              { index.toUpperCase() }
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {
              range.map(t => <td key={ t } style={ { height: '10px', background: t } }/>)
            }
          </tr>
          <tr>
            {
              range.map(t => {
                return <td key={ t }>{ fnum(scale.invertExtent(t)[0]) }</td>
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

	render() {
		return (
			<MapBoxMap zoom={ this.props.zoom }
        height={ this.props.height }
        layers={ this.createLayers() }
        controls={ this.generateControls() }
        hoverData={ this.state.hoverData }/>
		)
	}
}

TestMap.defaultProps = {
  geoid: '36',
  geoLevel: 'tracts',
  index: 'bric', // 'nri', 'sovi', 'sovist', 'builtenv'
  height: 600,
  zoom: 6
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
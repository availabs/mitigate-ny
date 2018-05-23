import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createMatchSelector } from 'react-router-redux';
import { getHazardDetail } from 'store/modules/riskIndex'
import { getChildGeo } from 'store/modules/geo'
import * as scale from 'd3-scale'
import * as chromatic from 'd3-scale-chromatic'
import * as color from 'd3-color'

import ElementBox from 'components/light-admin/containers/ElementBox'
import ChoroplethMap from 'components/mapping/ChoroplethMap'

import { MAPBOX_TOKEN } from 'store/config'

let toColorArray = c => {
  return [c.r, c.g, c.b]
}

class HazardMap extends Component {
  
  componentWillMount() {
    let geoid = this.props.geoid || '36'
    if (!this.props.riskIndex[geoid] || !this.props.riskIndex[geoid].tracts) {
      this.props.getHazardDetail(geoid, 'tracts')
    }

    if (!this.props.riskIndex[geoid] || !this.props.riskIndex[geoid].counties) {
      this.props.getHazardDetail(geoid, 'counties')
    }

    if (!this.props.geo[geoid] || !this.props.geo[geoid].tracts) {
      this.props.getChildGeo(geoid, 'tracts')
    }

    if (!this.props.geo[geoid] || !this.props.geo[geoid].counties) {
      this.props.getChildGeo(geoid, 'counties')
    }
  
  }
  
  colorLegend (scale) {
    let ticks = scale.ticks(5)
    return (
      <span >
        <div className="layout">
          {ticks.map(t => (
           <div key={t} className="legend" style={{background: `${scale(t)}`, width: `${100 / ticks.length}%`}} />
          ))}
        </div>
        <div className="layout">
          {ticks.map(t => (
           <div key={t} className="legend" style={{width: `${100 / ticks.length}%`, fontSize: 10}} >{t.toFixed(1)}</div>
          ))}
        </div>
      </span>
    )
  }

  elevationLegend (scale) {
    let ticks = scale.ticks(6)
    return (
     <span >
        <div className="layout">
          {ticks.map((t,i) => (
           <div key={i} className="legend" style={{background: `#333`, height: `${(i*5)+1}px`, width: `${100 / ticks.length}%`}} />
          ))}
        </div>
        <div className="layout">
          {ticks.map(t => (
           <div key={t} className="legend" style={{width: `${100 / ticks.length}%`, fontSize: 10}} >{(t/1000000).toLocaleString()}M</div>
          ))}
        </div>
      </span>

    )
  }

  renderInfoContainer (hazard, colorScale, elevationScale) {
    return (
      <div className="control-panel">
        {this.props.riskIndex.meta[hazard].name} Risk
        {this.colorLegend(colorScale)}
        Built Environment ($)
        {this.elevationLegend(elevationScale)}
        <hr style={{marginBottom: 5}}/>
        <p style={{margin: 0, fontSize: 10}}>Data source: <a target="_blank" rel="noopener noreferrer" href="http://riskindex.atkinsatg.com/Home/Index">FEMA Risk Index</a></p>
      </div>
    )
  }
 
  renderMap (hazard) {
    let geoid = this.props.geoid || '36'
    if(!this.props.riskIndex[geoid] || !this.props.riskIndex[geoid].tracts || !this.props.riskIndex[geoid].counties || !this.props.geo[geoid]) {
      return <div> Loading ... </div>
    }
    // console.log('hazard', hazardData)
    let hazardDomain = []
    let secondaryDomain = []
    // hazard = 'BUILTENV'
    let secondary = 'BUILTENV'
    Object.keys(this.props.geo[geoid]).forEach(geoLevel => {
      this.props.geo[geoid][geoLevel]
        .features.forEach((feat, i) => { // for each tract
          
          // if( i < 10 ) {
          //   console.log('raw tract or county',this.props.riskIndex[geoid][geoLevel][feat.properties.geoid], hazard)
          // }
          feat.properties.hazard = this.props.riskIndex[geoid][geoLevel][feat.properties.geoid] 
          ? this.props.riskIndex[geoid][geoLevel][feat.properties.geoid][`${hazard}_SCORE`]
          : 0
          feat.properties.elevation = this.props.riskIndex[geoid][geoLevel][feat.properties.geoid] 
          ? this.props.riskIndex[geoid][geoLevel][feat.properties.geoid][secondary]
          : 0
          if (feat.properties.hazard > 0 && feat.properties.elevation > 0 && geoLevel === 'tracts'){
            hazardDomain.push(feat.properties.hazard)
            secondaryDomain.push(feat.properties.elevation)
          }
      })
    })
    
    let hazardScale = scale.scaleSequential(chromatic.interpolateViridis)
      .domain([Math.min(...hazardDomain), Math.max(...hazardDomain)])
    
    let secondaryScale = scale.scaleSqrt()
      .domain([Math.min(...secondaryDomain), Math.max(...secondaryDomain)])
      .range([5,500])
      .clamp(true)

   
    this.props.geo[geoid].tracts.features.forEach( (d,i) => {
      if(i < 10) {
        console.log(secondaryScale(d.properties.elevation))
      }
    })

    let tractLayer = {
      geo: this.props.geo[geoid].tracts,
      colorScale: t => toColorArray(color.rgb(hazardScale(t.hazard))),
      elevationScale: t => secondaryScale(t.elevation) * 10,
      onHover: function (event) {
        const {object, x, y } = event;
        this.setState({hoveredFeature: object, x, y, geoid: object ? object.properties.geoid : null});
      }, 
      renderTooltip: function () {
        const {hoveredFeature, x, y} = this.state;
        return hoveredFeature && (
          <div className="mapbox_tooltip" style={{left: x, top: y}}>
            <div style={{color:'white', fontWeight: 700, fontSize: 14}}>{hoveredFeature.properties.geoid}</div>
            <div style={{fontSize: 12}}>Risk Score: {hoveredFeature.properties.hazard.toLocaleString()}</div>
          </div>
        );
      }
    }
    
    let countyLayer = {
      geo: this.props.geo[geoid].counties,
      colorScale: (geoid) => {
          // if (geoid === this.state.geoid) {
          //   return [255, 255, 255, 1]
          // }
          return [255, 255, 255, 1]
      },
      onHover: function (event) {
        const {object, x, y } = event;
        this.setState({hoveredFeature: object, x, y, geoid: object ? object.properties.geoid : null});
      }, 
      renderTooltip: function () {
        const {hoveredFeature, x, y} = this.state;
        return hoveredFeature && (
          <div className="mapbox_tooltip" style={{left: x, top: y}}>
            <div style={{color:'white', fontWeight: 700, fontSize: 14}}>{hoveredFeature.properties.name}</div>
            <div style={{fontSize: 12}}>Risk Score: {hoveredFeature.properties.hazard.toLocaleString()}</div>
            <div style={{fontSize: 12}}>Built Env: {secondaryScale(hoveredFeature.properties.elevation).toLocaleString()}</div>
          </div>
        );
      }
    }
  

    return (
        <ChoroplethMap 
          mapbox_token={MAPBOX_TOKEN} 
          layers={[tractLayer,countyLayer]} 
          infoContainer={this.renderInfoContainer(hazard,hazardScale,secondaryScale)}
        />
    )
  }

  render () {
    const { params } = createMatchSelector({ path: '/risk-index/h/:hazard' })(this.props) || {}
    if(!params || !params.hazard) {
      return <ElementBox />
    }
    return (
      <ElementBox > 
       {this.renderMap(params.hazard)}
      </ElementBox>
    ) 
  }
}

const mapDispatchToProps = { getHazardDetail, getChildGeo };

const mapStateToProps = state => {
  return {
    riskIndex: state.riskIndex,
    geo: state.geo,
    router: state.router
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(HazardMap)
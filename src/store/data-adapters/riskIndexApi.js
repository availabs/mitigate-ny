let d3 = require('d3-dsv')
const HOST = '/';

class riskIndexAPI {
  constructor () { 
    this.fullData = []
  }

  getData () {
    return new Promise((resolve, reject) => {
      if(this.fullData.length > 0) {
        resolve(this.fullData)
      } else { 
        fetch(`${HOST}risk_index/all_nri_ny.csv`, {
          headers: { "Content-Type": "text/csv" }
        })
        .then(function(response) {
          return response.ok ? response.text() : Promise.reject(response.status);
        })
        .then(function(text) {
          return d3.csvParse(text);
        })
        .then(tmcResponse => {
          this.fullData = tmcResponse
          resolve(tmcResponse)
        })
      }
    })
  }

  getHazardTotal (geoid) {
    return new Promise((resolve, reject) => {
      this.getData().then(riskData => {
        resolve(this.getGeoTotal(geoid))
      })
    })
  }
  
  getHazardDetail (geoid, type) {
    return new Promise((resolve, reject) => {
      console.time('HazardData.fetch')
      this.getData().then(riskData => {
        console.timeEnd('HazardData.fetch')
        console.time('HazardData.reduce')
        let groupByLength = type === 'counties' ? 5 : 11
        let children = riskData.reduce((out, row) => {
          let childId = row.Tract.substr(0,groupByLength)
          if(!out[childId]) {
            out[childId] = this.getGeoTotal(childId)
          }
          return out
        },{})
        console.timeEnd('HazardData.reduce')
        resolve(children)
      })
    })
  }
  
  getGeoTotal (geoid, scoreType) {
    // assumes you have already called getData
    // scoreType = scoreType === 'value' ? '' : '_SCORE' 
    let geoTotal = this.fullData
      .filter(row => row.Tract.startsWith(geoid))
      .reduce((out, row) => {
        Object.keys(row).forEach(hazard => {
          let key = hazard
          if(!out[key]){
            out[key] = {score:0, count: 0}
          }
          // console.log('hey', key)
          if(row[key] && !isNaN(+row[key]) && row[key] > 0) {
            out[key].score += +row[key]
            out[key].count += 1
          }
        })
        return out
      }, {})  
    return Object.keys(geoTotal).reduce((out,haz) =>{
      out[haz] = geoTotal[haz].score / geoTotal[haz].count
      return out
    },{})
  }
}

export default riskIndexAPI

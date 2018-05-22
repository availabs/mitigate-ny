let topojson = require('topojson')
const HOST = '/';


class riskIndexAPI {
  constructor () { 
    this.data = {}
  }

  getData (geoid) {
    return new Promise((resolve, reject) => {
      if(this.data[geoid]) {
        resolve(this.data[geoid])
      } else { 
        fetch(`${HOST}geo/${geoid}.json`, {
          headers: { 'Content-Type': 'text/csv' }
        })
        .then(response => response.json())
        .then(geoResponse => {
          this.data[geoid] = geoResponse
          resolve(geoResponse)
        })
      }
    })
  }

  getChildGeo (geoid, type) {
    return new Promise((resolve, reject) => {
      // console.time('topojson.get')
      this.getData(geoid).then(topology  => {
        // console.timeEnd('topojson.get')
        // console.time('topojson.feature')
        resolve(
          topojson.feature(topology, topology.objects[type])
        )
        // console.timeEnd('topojson.feature')
      })
    })
  }

  
}

export default riskIndexAPI
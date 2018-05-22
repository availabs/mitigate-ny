let Promise = require('bluebird');
let d3 = require('d3');
let fs = require('fs')


const hazards = [
	'avalanche',
	'blizzard',
	'coldwave',
	'drought',
	'earthquake',
	'hail',
	'heatwave',
	'hurricane',
	'icestorm',
	'landslide',
	'lightning',
	'rivirine',
	'wildfire',
	'wind'
]


function readFilePromise(dir,hazard) {
	return new Promise(function (resolve, reject) {
		fs.readFile( dir+hazard+'.csv', 'utf8', function (err, data) {
			if (err) {
				console.log('error', err)
				reject(err)
			}
			resolve({
				hazard,
				data:d3.csvParse(data)
			})
		})
	})
}


Promise.map(hazards, (hazard) => {
		return readFilePromise('./risk-index/', hazard)
	},{concurrency: 5})
	.then(datasets => {
		let final = datasets.reduce((output, current) => {
			current.data.forEach(row => {
				let theTract = Object.keys(row)[0]
				if(!output[row[theTract]]) {
					output[row[theTract]] = {tract: row[theTract]}
				}
				output[row[theTract]][current.hazard] = row['VALUE']

			})
			return output
		},{})

		let csv = d3.csvFormat(Object.values(final))
		fs.writeFile(`hazards.csv`, csv, (err) => {
		    if(err) { 
		    	console.log('error:', err)
		    	reject(err) 
		    }
		});
	})
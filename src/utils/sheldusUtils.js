const LimitedAttributes = {
	num_events: "Occurances",
	property_damage: "Property Damage $"
}

const sheldusAttributes = {
	num_events: "Occurances",
	property_damage: "Property Damage $",
	crop_damage: "Crop Damage $",
	injuries: "Injuries",
	fatalities: "Fatalities"
}

const getHazardName = hazardid =>
	hazardid === "winterweat"
		? "Winter Weather"
		: hazardid.split("")
			.map((d, i) => i === 0 ? d.toUpperCase() : d)
			.join("")

module.exports = {
	processSheldus : (data,key) => {
		let yearly = {
			id: sheldusAttributes[key],
			"color": "#047bf8",
			data: Object.keys(data).reduce((total,year) => {
				total.push({
						"x": +year,
			        	"y": data[year][key] || 0
			     })
				return total
			}, [])
		}
		let fiveYear = {
			id: '5 Year Avg ' + sheldusAttributes[key],
			"color": "#e65252",
			data: Object.keys(data).reduce((total,year) => {
				let avgTotal = 0
				let count = 0
				for(let i=4; i >= 0; i-- ) {
					if(data[year-i] && data[year-i][key]){
						avgTotal += data[year-i][key]
					}
					count += 1 
				}
				let avg = !isNaN(avgTotal / count)  > 0 
					? (avgTotal / count)
					: 0 
				total.push({
						"x": +year,
			        	"y": +(avg.toFixed(2))
			     })
				return total
			}, [])

		}
		return [yearly,fiveYear]
	},

	getHazardName,

	processDataForBarChart: (rawData, geoids, lossType="property_damage") => {
// console.log("<processDataForBarChart>",rawData)
		const data = {}, keys = {};
		for (const geoid in rawData) {
			if (!geoids.includes(geoid)) continue;
			for (const hazardid in rawData[geoid]) {
				if (!(hazardid in keys)) {
					keys[hazardid] = true;
				}
				for (const year in rawData[geoid][hazardid]) {
					if (!(year in data)) {
						data[year] = { year };
					}
					if (!(hazardid in data[year])) {
						data[year][hazardid] = 0;
					}
					const value = data[year][hazardid] + +rawData[geoid][hazardid][year][lossType];
					data[year][hazardid] = value;
				}
			}
		}
		return { data: Object.values(data), keys: Object.keys(keys) };
	},

	processSheldus5year : (data, key, type) => {
		type = type ? type : 'avg'
		return Object.keys(data).reduce((total,year) => {
			let avgTotal = 0
			let count = 0
			for(let i=4; i >= 0; i-- ) {
				if(data[year-i] && data[year-i][key]){
					avgTotal += data[year-i][key]
				}
				count += 1 
			}
			let avg = !isNaN(avgTotal / count) && count > 0 
				? (avgTotal / count)
				: 0 
			total[year] = type === 'avg' ?  +(avg.toFixed(2)) : +(avgTotal.toFixed(2))
			return total
		}, {})
	},
	
	sumData : (data, key, len) => {
		return Object.keys(data).reduce((total,year) => {
			let avgTotal = 0
			let count = 0
			for(let i=(len-1); i >= 0; i-- ) {
				if(data[year-i] && data[year-i][key]){
					avgTotal += data[year-i][key]
				}
				count += 1 
			}
			let avg = !isNaN(avgTotal / count) && count > 0 
				? (avgTotal / count)
				: 0 
			total[year] = +(avgTotal.toFixed(2))
			return total
		}, {})
		
	},

	total : (data,key) => {
		// this is a stupid hack
		// to remove crud keys that falcor adds to object
		let numYears = Object.keys(data)
			.filter(d => d.length === 4)
			.length

		if(numYears <= 0) return ''  

		let total =  Object.keys(data).reduce((total,year) => {
			if(data[year][key] && !isNaN(+data[year][key])) {
				total += data[year][key]
			}
			return total
		}, 0)
		return fnum(total)
	},

	avg : (data,key) => {
		// this is a stupid hack
		// to remove crud keys that falcor adds to object
		let numYears = Object.keys(data)
			.filter(d => d.length === 4)
			.length

		if(numYears <= 0) return ''
		

		let total =  Object.keys(data).reduce((total,year) => {
			if(data[year][key] && !isNaN(+data[year][key])) {
				total += data[year][key]
			}
			return total
		}, 0)

			
		
		return fnum( total / numYears )
	},

	avgData : (data,key, len) => {
		return Object.keys(data).reduce((total,year) => {
			let avgTotal = 0
			let count = 0
			for(let i=len-1; i >= 0; i-- ) {
				if(data[year-i] && data[year-i][key]){
					avgTotal += data[year-i][key]
				}
				count += 1 
			}
			let avg = !isNaN(avgTotal / count) && count > 0 
				? (avgTotal / count)
				: 0 
			total[year] = +(avg.toFixed(2)) 
			return total
		}, {})
		
	}

}

function fnum(x) {
	if(isNaN(x)) return x;



	if(x < 9999) {
		return x.toFixed(0);
	}

	if(x < 1000000) {
		return Math.round(x/1000) + "K";
	}
	if( x < 10000000) {
		return (x/1000000).toFixed(2) + "M";
	}

	if(x < 1000000000) {
		return (x/1000000).toFixed(1) + "M";
	}

	if(x < 1000000000000) {
		return (x/1000000000).toFixed(1) + "B";
	}

	return "1T+";
}

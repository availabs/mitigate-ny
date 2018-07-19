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

const getHazardName = hazardid => {
	switch (hazardid) {
		case "winterweat":
			return "Winter Weather";
		default:
			return hazardid.split("").map((d, i) => i == 0 ? d.toUpperCase() : d).join("");
	}
}

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
		const data = {}, keys = {};
		for (const geoid in rawData) {
			if (!geoids.includes(geoid)) continue;
			for (const hazardid in rawData[geoid]) {
				const hazardName = getHazardName(hazardid);
				if (!(hazardName in keys)) {
					keys[hazardName] = true;
				}
				for (const year in rawData[geoid][hazardid]) {
					if (!(year in data)) {
						data[year] = { year };
					}
					if (!(hazardName in data[year])) {
						data[year][hazardName] = 0;
					}
					const value = data[year][hazardName] + +rawData[geoid][hazardid][year].property_damage;
					data[year][hazardName] = value;
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
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

	processSheldus5year : (data,key,type) => {
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
		
	}

}
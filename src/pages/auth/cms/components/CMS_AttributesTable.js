import React from 'react';

export default ({ attributes, remove=null }) => {
	const rows = Object.keys(attributes)
		.sort((a, b) => (a < b) ? -1 : 1)
		.map(key => ({ key, value: attributes[key] }))
	return (
		<table className="table table-lightborder table-hover"
			style={ { tableLayout: "fixed" } }>
			<thead>
				<tr>
					<th colSpan={ 2 }>Key</th>
					<th colSpan={ 2 }>Value</th>
					{ remove ? <th /> : null }
				</tr>
			</thead>
			<tbody>
				{
					rows.map(row =>
	    				<tr key={ row.key }>
	    					<td colSpan={ 2 }>{ row.key }</td>
	    					<td colSpan={ 2 }>{ row.value }</td>
	    					{ !remove ? null :
		    					<td>
		    						<button className="btn btn-sm btn-outline-danger"
		    							onClick={ () => remove(row.key) }>
		    							Remove
		    						</button>
		    					</td>
		    				}
	    				</tr>
					)
				}
			</tbody>
		</table>
	)
}
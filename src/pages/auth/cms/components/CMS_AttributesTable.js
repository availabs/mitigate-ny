import React from 'react';

export default ({ attributes, remove=null, edit=null }) => {
	const rows = Object.keys(attributes)
		.sort((a, b) => (a < b) ? -1 : 1)
		.map(key => ({ key, value: attributes[key] }))
	return (
		<table className="table table-lightborder table-hover"
			style={ { tableLayout: "fixed" } }>
			<thead>
				<tr>
					<th>Key</th>
					<th>Value</th>
					{ (remove || edit) ? <th /> : null }
				</tr>
			</thead>
			<tbody>
				{
					rows.map(row =>
	    				<tr key={ row.key }>
	    					<td>{ row.key }</td>
	    					<td>{ row.value }</td>
	    					{ !(remove || edit) ? null :
		    					<td>
		    						{ !remove ? null :
			    						<button className="btn btn-sm btn-outline-danger"
			    							onClick={ () => remove(row.key) }
			    							type="button">
			    							Remove
			    						</button>
			    					}
		    						{ !edit ? null :
			    						<button className="btn btn-sm btn-outline-success"
			    							onClick={ () => edit(row.key) }
			    							type="button">
			    							Edit
			    						</button>
			    					}
		    					</td>
		    				}
	    				</tr>
					)
				}
			</tbody>
		</table>
	)
}
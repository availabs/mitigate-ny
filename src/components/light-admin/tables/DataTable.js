import React from 'react'
import { Link } from 'react-router-dom'

const Selector = ({ value, options, onSelect, column }) =>
  <div className="btn-group">
    <button className="btn btn-primary dropdown-toggle"
      data-toggle="dropdown">
      { column }
    </button>
    <div className="dropdown-menu"
      style={ { maxHeight: "300px", overflowY: "auto" } }>
      {
        options.map(o =>
          <span className="dropdown-item" key={ o }
            onClick={ () => onSelect(column, o) }
            style={ value.includes(o) ? { backgroundColor: "#00e", color: "#fff" } : null }>
            { o }
          </span>
        )
      }
    </div>
  </div>

export default ({ tableData=[],
                  columns=[],
                  links={},
                  onClick=null,
                  filterColumns,
                  toggleFilterColumn,
                  filteredColumns }) => {
  // if (!tableData || tableData.length === 0) {
  //   return ('No Data Sento to table')
  // }
  if (!columns.length) {
    columns = Object.keys(tableData[0])
  }
  return (
    <table className="table table-lightborder table-hover">
      <thead>
        <tr>
          {
            columns.map(col => {
              const filtered = filterColumns.filter(d => d.column === col);
              if (!filtered.length) {
                return <th key={ col }>{ col }</th>;
              }
              return <th key={ col }>
                <Selector column={ col }
                  options={ filtered[0].values }
                  value={ filteredColumns[col] || [] }
                  onSelect={ toggleFilterColumn }/>
              </th>
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          tableData.map((row, i) => (
            <tr key={ i } onClick={ onClick ? onClick.bind(null, row) : null }>
              { columns.map((col, ii) => {
                  return (
                    (col in links) ?
                    <td key={ ii }>
                      <Link to={ links[col](row) }>{ row[col] }</Link>
                    </td>
                    : <td key={ ii }>{ row[col] }</td>
                  )
                })
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}


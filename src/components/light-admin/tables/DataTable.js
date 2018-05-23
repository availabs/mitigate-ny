import React from 'react'

export default ({ tableData }) => {
  if (!tableData || tableData.length === 0) {
    return ('No Data Sento to table')
  }
  let columns =  Object.keys(tableData[0])
  return (
    <table className="table table-lightborder table-hover">
      <thead>
        <tr>
          {columns.map((col,i) => (<th key={i}>{col}</th>))}
        </tr>
      </thead>
      <tbody>
        {
          tableData.map((row, i) => (
            <tr key={i}>
              {columns.map((col,index) => (<td key={index}>{row[col]}</td>))}
            </tr>
          ))
        }
      </tbody>
    </table>

  )
}


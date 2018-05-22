import React from 'react'

export default ({ numRecords, numPerPage, page }) => {
  return (
    <div className="pagination-w" style={{width: '100%'}}>
      <div className="pagination-info">Showing Records { parseInt(numRecords*page, 10) + 1 } - {(numRecords*page)+numPerPage+1}</div>
      <div className="pagination-links">
        <ul className="pagination">
          <li className="page-item disabled"><a className="page-link" > Previous</a></li>
          <li className="page-item active"><a className="page-link" > 1</a></li>
          <li className="page-item"><a className="page-link" > 2</a></li>
          <li className="page-item"><a className="page-link" > 3</a></li>
          <li className="page-item"><a className="page-link" > Next</a></li>
        </ul>
      </div>
    </div>
  )
}

import React from 'react'

const PageItem = ({ index, page, set }) =>
  <li className={ "page-item" + (index == page ? " active" : "") }
    onClick={ set.bind(null, index) }>
    <a className="page-link">{ index + 1 }</a>
  </li>

export default ({ length, size, page, set, prev, next }) => {
  const maxPages = Math.ceil(length / size);
  let pageItems = [];
  for (let i = 0; i < maxPages; ++i) {
    pageItems.push(<PageItem key={ i } index={ i } page={ page } set={ set }/>);
  }
  return (
    <div className="pagination-w" style={{width: '100%'}}>
      <div className="pagination-info">
        Showing Records { size * page + 1 } - { Math.min(length, size * page + size) }
      </div>
      <div className="pagination-links">
        <ul className="pagination">
          <li className={ "page-item" + (page == 0 ? " disabled" : "") }
            onClick={ prev }>
            <a className="page-link">Previous</a>
          </li>
          { pageItems }
          <li className={ "page-item" + (page == (maxPages - 1) ? " disabled" : "") }
            onClick={ next }>
            <a className="page-link">Next</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

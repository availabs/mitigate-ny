import React from 'react'
import ElementBox from '../containers/ElementBox'
import DataTable from './DataTable'
import Pagination from './Pagination'

export default (props) => (
<ElementBox title={props.title}>
  <div className="controls-above-table">
    <div className="row">
      <div className="col-sm-6">
        <form className="form-inline">
          <input className="form-control form-control-sm bright" placeholder="Search" type="text" />
        </form>
      </div>
      <div className="col-sm-6">
        <form className="form-inline justify-content-sm-end">
          <a className="btn btn-sm btn-secondary" href="">Download CSV</a>
        </form>
      </div>
    </div>
  </div>

  <div className="table-responsive">
    <DataTable tableData={props.data.filter((d,i) => (i < 13))}/>
  </div>
  <div className='controls-below-table'>
    <Pagination numRecords={props.data.length} page={0} numPerPage={10} />
  </div>
</ElementBox>
)



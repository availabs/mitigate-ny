import React from 'react'
import ElementBox from '../containers/ElementBox'
import DataTable from './DataTable'
import Pagination from './Pagination'

 class TableBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      filter: "",
      filteredColumns: {}
    }
    this.setPage = this.setPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.setFilter = this.setFilter.bind(this);
  }
  setPage(page) {
    this.setState({ page });
  }
  previousPage() {
    const page = Math.max(0, this.state.page - 1);
    this.setState({ page });
  }
  nextPage() {
    const maxPages = Math.ceil(this.getFilteredData().length / this.props.pageSize);
    const page = Math.min(maxPages - 1, this.state.page + 1);
    this.setState({ page });
  }
  getFilteredData() {
    let filterKey = this.props.filterKey,
      filter = this.state.filter,
      data = this.props.data,
      fc = this.state.filteredColumns;
    for (const c in fc) {
      data = data.filter(d => fc[c].includes(d[c]))
    }
    if (!filter) return data;
    if (!filterKey.length) {
      filterKey = Object.keys(data[0])[0];
    }
    return data.filter(d =>
      d[filterKey] && d[filterKey].toString().toLowerCase().includes(filter)
    );
  }
  setFilter(e) {
    this.setState({ filter: e.target.value.toLowerCase() });
  }

  getFilterValues(column) {
    const values = {};
    this.props.data.forEach(d => {
      if (d[column]) {
        values[d[column]] = true
      }
    })
    return Object.keys(values).filter(d => d)
  }
  toggleFilterColumn(column, value) {
    let { filteredColumns } = this.state;
    if (!(column in filteredColumns)) {
      filteredColumns[column] = [value];
    }
    else {
      if (filteredColumns[column].includes(value)) {
        filteredColumns[column] = filteredColumns[column].filter(v => v !== value)
        if (!filteredColumns[column].length) {
          delete filteredColumns[column];
        }
      }
      else {
        filteredColumns[column].push(value)
      }
    }
console.log("<toggleFilterColumn>",filteredColumns)
    this.setState({ filteredColumns });
  }

  render() {
    const data = this.getFilteredData(),
      paginate = data.length > this.props.pageSize ? (
        <div className='controls-below-table'>
          <Pagination
            length={ data.length }
            page={ this.state.page }
            size={ this.props.pageSize }
            set={ this.setPage }
            prev={ this.previousPage }
            next={ this.nextPage }
          />
        </div>
    ) : null;

////
    const page = this.state.page,
      size = this.props.pageSize,
      tableData = data.slice(page * size, page * size + size);

    const filterColumns = this.props.filterColumns.map(column =>
      ({ column, values: this.getFilterValues(column) }))

    return (
      <ElementBox title={this.props.title} desc={this.props.desc}>
        { !this.props.showControls ? null :
          <div className="controls-above-table">
            <div className="row">
              <div className="col-sm-6">
                <form className="form-inline">
                  <input className="form-control form-control-sm bright"
                    onChange={ this.setFilter }
                    placeholder="Search" type="text" />
                </form>
              </div>
              <div className="col-sm-6">
                <form className="form-inline justify-content-sm-end">
                  <a className="btn btn-sm btn-secondary" href="#">Download CSV</a>
                </form>
              </div>
            </div>
          </div>
        }
        <div className="table-responsive"
          style={ { minHeight: `${ this.props.pageSize * 46 + 39 }px` } }>
          <DataTable tableData={ tableData }
            columns={ this.props.columns }
            links={ this.props.links }
            onClick={ this.props.onClick }
            filterColumns={ filterColumns }
            toggleFilterColumn={ this.toggleFilterColumn.bind(this) }
            filteredColumns={ this.state.filteredColumns }/>
        </div>
        { paginate }
      </ElementBox>
    )
  }
}

TableBox.defaultProps = {
  pageSize: 13,
  data: [],
  columns: [],
  links: {},
  filterKey: "",
  onClick: null,
  showControls: true,
  filterColumns: []
}

export default TableBox;
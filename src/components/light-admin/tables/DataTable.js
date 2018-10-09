import React from 'react'
import { Link } from 'react-router-dom'

import "./DataTable.css"

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
            onClick={ e => (e.stopPropagation(), onSelect(column, o)) }
            style={ value.includes(o) ? { backgroundColor: "#00e", color: "#fff" } : null }>
            { o }
          </span>
        )
      }
    </div>
  </div>

////

class Row extends React.Component {
  render() {
    const {
      onClick,
      columns,
      links,
      row,
      expandColumns,
      numColumns = 0,
      expansionRow = false,
      expanded = false,
      urlColumn = null
    } = this.props
    return (
      <tr onClick={ onClick ? onClick.bind(null, row) : null }
        style={ expansionRow ? { backgroundColor: "#eee" } : expanded ? { backgroundColor: "#ddd" } : null }>
        { columns.map((col, ii) => {
            return (
              (col in links) ?
                <td key={ ii } colSpan={ Math.floor(numColumns / columns.length) }>
                  <Link to={ links[col](row) }>{ row[col] }</Link>
                </td>
              : (col === urlColumn) ?
                <td key={ ii } colSpan={ Math.floor(numColumns / columns.length) }>
                  { row[col] ? <a href={ row[col] } target="_blank">url</a> : null }
                </td>
              : <td key={ ii } colSpan={ Math.floor(numColumns / columns.length) }>{ row[col] }</td>
            )
          })
        }
      </tr>
    )
  }
}

export default class DataTable extends React.Component {
  state = {
    expanded: -1
  }
  componentWillReceiveProps(newProps) {
    const { expanded } = this.state;
    if (expanded >= newProps.tableData.length) {
      this.setState({ expanded: -1 });
    }
  }
  onClick(i) {
    if (i === this.state.expanded) {
      this.setState({ expanded: -1 });
    }
    else {
      this.setState({ expanded: i })
    }
  }
  render() {
    let { tableData=[],
      columns=[],
      links={},
      onClick=null,
      filterColumns,
      toggleFilterColumn,
      filteredColumns,
      expandColumns=[],
      urlColumn=null,
      toggleSortColumn,
      sortColumn,
      sortOrder
    } = this.props;
    if (!columns.length) {
      columns = Object.keys(tableData[0])
    }
    const { expanded } = this.state;
    return (
      <table className="table table-lightborder table-hover">
        <thead>
          <tr>
            {
              columns.map(col => {
                const filtered = filterColumns.filter(d => d.column === col);
                if (!filtered.length) {
                  return (
                    <th key={ col } onClick={ () => toggleSortColumn(col) } className="sortable"
                      style={ sortColumn === col ? { borderRadius: "5px", backgroundColor: sortOrder === 1 ? "#0e0" : "#e00" } : null }>
                      { col }
                    </th>
                  )
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
            tableData.slice(0, expanded + 1).map((row, i) =>
              <Row key={ i } row={ row } columns={ columns } links={ links } urlColumn={ urlColumn }
                onClick={ onClick || (expandColumns.length && this.onClick.bind(this, i)) }
                expanded={ expanded === i }/>
            )
          }
          { expanded === -1 ? null :
            <Row key={ -1 } row={ tableData.slice(expanded, expanded + 1).pop() }
              columns={ expandColumns } links={ {} } numColumns={ columns.length } expansionRow={ true }/>
          }
          {
            tableData.slice(expanded + 1, tableData.length).map((row, i) =>
              <Row key={ i } row={ row } columns={ columns } links={ links } urlColumn={ urlColumn }
                onClick={ onClick || (expandColumns.length && this.onClick.bind(this, expanded + 1 + i)) }/>
            )
          }
        </tbody>
      </table>
    )
  }
}


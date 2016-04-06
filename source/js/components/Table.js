'use strict'

import React, {Component} from 'react';
import {Table, TableHeaderColumn, TableRow, TableHeader, TableRowColumn, TableBody, TextField, Toggle} from 'material-ui';

const styles = {
  propContainerStyle: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
};

const tableData = [
  {
    name: 'John Smith',
    status: 'Employed'
  },
  {
    name: 'Randal White',
    status: 'Unemployed'
  },
  {
    name: 'Stephanie Sanders',
    status: 'Employed'
  },
  {
    name: 'Steve Brown',
    status: 'Employed'
  },
  {
    name: 'Joyce Whitten',
    status: 'Employed'
  },
  {
    name: 'Samuel Roberts',
    status: 'Employed'
  },
  {
    name: 'Adam Moore',
    status: 'Employed'
  },
];

export default class TableExampleComplex extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fixedHeader: true,
      showRowHover: true,
      selectable: true,
      multiSelectable: true,
      deselectOnClickaway: true
    };
  }

  handleToggle(event, toggled){
    this.setState({
      [event.target.name]: toggled,
    });
  };

  handleChange(event){
    this.setState({height: event.target.value});
  };

  render() {
    return (
      <div>
        <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
          onRowSelection={this._onRowSelection}
        >
          <TableHeader enableSelectAll={this.state.enableSelectAll}>
            <TableRow>
              {this.props.cols.map( (row, index) => (
                <TableHeaderColumn tooltip={row}>{row}</TableHeaderColumn>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
            className="table-body"
          >
            {this.props.tableData.map( (row, index) => (
              <TableRow key={index}>
                <TableHeaderColumn>{row}</TableHeaderColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}
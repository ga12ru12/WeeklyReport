'use strict'

import React, {Component} from 'React';
import {TextField, RaisedButton} from 'material-ui';
import AppAction from '../AppAction';
import AppStore from '../AppStore'
import Table from './Table';
import Header from './Header';

export default class ViewReport extends Component {
  constructor(props) {
    super(props);
    var data = AppStore.getListIssue();
    this.state = {
      issuesAccomplished: data.issuesAccomplished,
      issuesPlan:  data.issuesPlan
    };
  }

  render() {
    var cols = ['Task Description', 'Component', 'Expected result', 'Version', 'Note'];
    return(
      <div>
        <Header logoUrl="./img/logo.png" webName="Weekly Report"/>
        <div className="container">
          <div className="markdown-body">
            <h2>Tasks accomplished this week:</h2>
          </div>
          <Table cols={cols} tableData={this.state.issuesAccomplished}/>
          <br/>
          <br/>
          <div className="markdown-body">
            <h2>Task to be done next week:</h2>
          </div>
          <Table cols={cols} tableData={this.state.issuesPlan}/>
        </div>
      </div>
    )
  }
}

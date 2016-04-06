'use strict'

import React, {Component} from 'react';
import {RaisedButton} from 'material-ui';

export default class Header extends Component{
  render(){
    return(
      <div className="header-container">
        <div>
          <div className="left-span">
            <img src={this.props.logoUrl} className="logo"/>
            <span>{this.props.webName}</span>
          </div>
          <div className="right-span">
            <RaisedButton label="Send Email" secondary={true} className="send-mail-btn"/>
          </div>
        </div>
      </div>
    )
  }
}
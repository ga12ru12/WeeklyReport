'use strict'

import React, {Component} from 'React';
import {TextField, RaisedButton} from 'material-ui';
import AppAction from '../AppAction';

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  doLogin(){
    AppAction.doLogin({
      username: this.refs.username.getValue(),
      password:this.refs.password.getValue()
    });
  }

  render() {
    return(
      <div className="login-div">
        <div className="login-form">
          <div className="logo-div">
            <div><img src="./img/logo.png" /></div>
            <div><span>Weekly Report</span></div>
          </div>
          <form>
            <div>
              <TextField ref="username" hintText="quang.hoang" floatingLabelText="User Name" fullWidth={true}/>
            </div>
            <div>
              <TextField
                hintText="Password Field"
                floatingLabelText="Password"
                type="password"
                fullWidth={true}
                ref="password"
                className="password"
              />
            </div>
            <div>
              <RaisedButton label="Login" secondary={true} className="login-btn" onTouchTap={this.doLogin.bind(this)}/>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

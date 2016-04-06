'use strict'

import React, {Component} from 'React';
import {TextField, RaisedButton, RefreshIndicator} from 'material-ui';
import AppAction from '../AppAction';
import AppStore from '../AppStore';

const style = {
  container: {
    position: 'relative',
    marginTop : 25,
    textAlign : 'center'
  },
  refresh: {
    display   : 'inline-block',
    position  : 'relative'
  }
};

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading : false
    };
    AppStore.addChangeListener('changeLogin', this.onChange.bind(this));
  }

  componentWillUnmount(){
    AppStore.removeChangeListener('changeLogin', this.onChange.bind(this));
  }

  onChange(){
    console.log('State changing....');
    this.setState(AppStore.getStateLoading());
    this.setState(AppStore.getErrors());
  }

  doLogin(){
    //AppAction.doLogin({
    //  username: this.refs.username.getValue(),
    //  password:this.refs.password.getValue()
    //});
    AppAction.doLogin({
      username: 'quang.hoang',
      password: 'Ga12ru12)'
    });
  }

  render() {
    var buttonDiv;
    if(this.state.isLoading){
      buttonDiv = (
        <div style={style.container}>
          <RefreshIndicator
            size={40}
            left={10}
            top={0}
            status="loading"
            style={style.refresh}
          />
        </div>
      );
    }else{
      buttonDiv = (
        <RaisedButton label="Login" secondary={true} className="login-btn" onTouchTap={this.doLogin.bind(this)}/>
      );
    }
    var error;
    if(this.state.errors && this.state.errors.login){
      error = (
        <div className="error-div">
          <span>Wrong account. Try againt pls!!!!</span>
        </div>
      );
    }
    return(
      <div className="login-div">
        <div className="login-form">
          <div className="logo-div">
            <div><img src="./img/logo.png" /></div>
            <div><span>Weekly Report</span></div>
          </div>
          <form>
            <div>
              <TextField
                ref="username"
                hintText="quang.hoang"
                floatingLabelText="User Name"
                fullWidth={true}/>
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
            {error}
            <div>
              {buttonDiv}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

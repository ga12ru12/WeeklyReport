'use strict'

import React, {Component} from 'React';
import AppStore from './AppStore';
import Login from './components/Login.jsx';
import ViewReport from './components/ViewReport.jsx';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

export default class App extends Component{
  constructor(props){
    super(props);
    this.state = AppStore.getStateLogin();
    AppStore.addChangeListener('change', this.onChange.bind(this));
  }

  componentWillUnmount(){
    AppStore.removeChangeListener('change', this.onChange.bind(this));
  }

  onChange(){
    console.log('State changing....');
    this.setState(AppStore.getStateLogin());
  }

  render(){
    if(this.state.isLogin){
      return(
        <ViewReport/>
      )
    }else{
      return(
        <Login/>
      )
    }
  }
}
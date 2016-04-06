'use strict'

import {EventEmitter} from 'events';
import AppDispatcher from './AppDispatcher';
import Immutable from 'immutable';

class AppStore extends EventEmitter{
  constructor(props) {
    super(props);
    this.isLogin = false;
    this.issuesAccomplished = [];
    this.issuesPlan = [];
    this.isLoading = false;
    this.errors = {};
  }

  emitChange(CHANGE_EVENT){
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(CHANGE_EVENT, callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(CHANGE_EVENT, callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  getStateLogin(){
    return {isLogin: this.isLogin};
  }

  getStateLoading(){
    return {isLoading: this.isLoading};
  }

  getListIssue(){
    return {
      issuesAccomplished  : this.issuesAccomplished,
      issuesPlan          : this.issuesPlan
    };
  }

  getErrors(){
    return {errors: this.errors};
  }

  dispatcherCallback(payload){
    var self = this;
    switch(payload.type) {
      case 'login':
        self.isLogin = true;
        self.issuesAccomplished = Immutable.fromJS(payload.data.issuesAccomplished);
        self.issuesPlan = Immutable.fromJS(payload.data.issuesPlan);
        self.errors = {};
        self.emitChange('change');
        break;
      case 'isLoading':
        self.isLoading = true;
        self.emitChange('changeLogin');
        break;
      case 'loginFailed':
        self.isLoading = false;
        self.errors.login = true;
        self.emitChange('changeLogin');
        break;
    }
  }

}

var appStore = new AppStore();

appStore.dispatchToken = AppDispatcher.register(appStore.dispatcherCallback.bind(appStore));

export default appStore;
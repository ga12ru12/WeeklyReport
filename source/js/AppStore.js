'use strict'

import {EventEmitter} from 'events';
import AppDispatcher from './AppDispatcher';

class AppStore extends EventEmitter{
  constructor(props) {
    super(props);
    this.isLogin = false;
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

  dispatcherCallback(payload){
    var self = this;
    switch(payload.type) {
      case 'login':
        self.isLogin = true;
        self.emitChange('change');
        break;
    }
  }

}

var appStore = new AppStore();

appStore.dispatchToken = AppDispatcher.register(appStore.dispatcherCallback.bind(appStore));

export default appStore;
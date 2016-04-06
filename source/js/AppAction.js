'use strict'
import AppDispatcher from './AppDispatcher';

class AppAction{
  doLogin(auth){
    console.log("doLogin issue:");
    AppDispatcher.dispatch({
      type: 'isLoading'
    });
    $.ajax({
      type: 'POST', url: '/api/login', contentType: 'application/json',
      data: JSON.stringify(auth),
      success: (function (data) {
        if(data && data.code && data.code === -1){
          AppDispatcher.dispatch({
            type: 'loginFailed'
          });
        }else{
          var info = {
            issuesAccomplished: data.issuesAccomplished,
            issuesPlan: data.issuesPlan
          };
          AppDispatcher.dispatch({
            type: 'login',
            data: info
          });
        }
      }).bind(this),
      error: function error(xhr, status, err) {
        // ideally, show error to user.
        console.log("Error adding issue:", err);
      }
    });
  }
}

export default new AppAction();
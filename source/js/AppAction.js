'use strict'
import AppDispatcher from './AppDispatcher';

class AppAction{
  doLogin(auth){
    console.log("doLogin issue:");
    //$.ajax({
    //  type: 'POST', url: '/api/login', contentType: 'application/json',
    //  data: JSON.stringify(auth),
    //  success: (function (data) {
    //    var info = {
    //      issuesAccomplished: data.issuesAccomplished,
    //      issuesPlan: data.issuesPlan
    //    };
        AppDispatcher.dispatch({
          type: 'login',
          data: auth
        });
    //  }).bind(this),
    //  error: function error(xhr, status, err) {
    //    // ideally, show error to user.
    //    console.log("Error adding issue:", err);
    //  }
    //});
  }
}

export default new AppAction();
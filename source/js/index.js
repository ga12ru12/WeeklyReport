'use strict'

import React from 'React';
import ReactDom from 'react-dom';
import App from './App';

$(function(){
  ReactDom.render(<App/>, document.getElementById('main'));
});

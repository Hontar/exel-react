import React, { Component } from 'react';
import './style/index.scss';

// import update from 'immutability-helper';


// import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';

import {store} from './store.js'

import MathTable from './containers/mathtable'




store.subscribe(() => console.log("store", store.getState()))

let App = () =>
<Provider store = {store}>  
  <div className="App">      
    <MathTable />
  </div>
</Provider>


export default App;

import {createStore, applyMiddleware} from "redux";

import thunk from "redux-thunk";

import reducers from "../reducers";
import initialState from "./initialState"; 
  
  export default createStore(
    reducers,
    initialState,
    applyMiddleware(thunk))
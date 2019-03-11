import * as types from "../constants/actionTypes";

import initialState from "../store/initialState";

export default (state = initialState.cell, {type, id, formula, cell}) => {
    switch (type) {
      case types.CELL_CURRENT: {
        return {
          ...state, id, formula, cell
        }
      }      
      case types.CELL_CLEAR: {
        return {
          ...initialState.cell
        }
      }
      default:
        return state;
    } 
  }
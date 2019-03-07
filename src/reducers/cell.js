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
    
    
    
  //   if (state === undefined){
  //     return {
  //       id: null,
  //       formula: '',
  //       cell: {},
  //     }
  //   }
  //   if (action.type === 'CELL_CURRENT'){
  //     return {
  //       id: action.id,
  //       formula: action.formula,
  //       cell: action.cell,
  //     }
  //   }
  //   if (action.type === 'CELL_SELECTED'){
  //     return {
  //       id: action.id,
  //       formula: action.formula,
  //       cell: action.cell,
  //     }
  //   }
  //   if (action.type === 'CELL_CLEAR'){
  //     return {
  //       id: null,
  //       formula: '',
  //       cell: {},
  //     }
  //   }
  //   return state;
  // }

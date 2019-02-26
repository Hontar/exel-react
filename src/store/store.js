import {createStore, combineReducers, applyMiddleware} from "redux";


let currentCellReducer = (state, action) => {
    if (state === undefined){
      return {
        id: null,
        formula: '',
        cell: {},
        // selected: false
      }
    }
    if (action.type === 'CELL_CURRENT'){
      return {
        id: action.id,
        formula: action.formula,
        cell: action.cell,
        // selected: 'selected'
      }
    }
    if (action.type === 'CELL_SELECTED'){
      return {
        id: action.id,
        formula: action.formula,
        cell: action.cell,
        // selected: 'selected'
      }
    }
    if (state === 'CELL_CLEAR'){
      return {
        id: null,
        formula: '',
        cell: {},
        // selected: false
      }
    }
  }
  
  const reducers = combineReducers({
    currentCellReducer: currentCellReducer  
  })
  
  export const store = createStore(reducers)
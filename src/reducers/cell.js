export default (state, action) => {
  if (state === undefined){
    return {
      id: null,
      formula: '',
      cell: {},
    }
  }
  if (action.type === 'CELL_CURRENT'){
    return {
      id: action.id,
      formula: action.formula,
      cell: action.cell,
    }
  }
  if (action.type === 'CELL_SELECTED'){
    return {
      id: action.id,
      formula: action.formula,
      cell: action.cell,
    }
  }
  if (action.type === 'CELL_CLEAR'){
    return {
      id: null,
      formula: '',
      cell: {},
    }
  }
  return state;
}
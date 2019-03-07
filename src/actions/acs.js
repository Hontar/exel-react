import * as types from "../constants/actionTypes";

export const actionInputCell = (id, formula, cell) => ({
  type: types.CELL_CURRENT,
  id,
  formula, cell 
});

export const actionCellClear = (payload) => ({
  type: types.CELL_CLEAR,
  payload 
})
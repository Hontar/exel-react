export function actionInputCell (id, formula, cell) {
    return {type: "CELL_CURRENT",
    id,
    formula, cell }
  }
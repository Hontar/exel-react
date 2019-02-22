export function actionInputCell (id, formula, cell) {
    console.log(formula)
    return {type: "CELL_CURRENT",
    id,
    formula, cell }
  }
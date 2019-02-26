import React, { Component } from 'react';

import ControlsContainer from './controlscontainer';

import Cell from '../components/cell';

export default class MathTable extends Component {
    constructor(props){
      super(props)
      this.state = {
        table: {
          A: {
            1:{
              id: "A1",
              x: 1,
              y: 'A',
              formula: '1',
              value: '1',
              className: 'cell'
            },
            2:{
              id: "A2",
              x: 2,
              y: 'A',
              formula: '2',
              value: '2',
              className: 'cell'
            },
          },
          B: {
            1:{
              id: "B1",
              x: 1,
              y: 'B',
              formula: '1',
              value: '1',
              className: 'cell'
            },
            2:{
              id: "B2",
              x: 2,
              y: 'B',
              formula: '=3+A1',
              value: '4',
              className: 'cell'
            }          
          }
        },
        selection: {
          selectedCells: [],
          pressed: false,
          start: null,
          end: null
        }        
      }
    }

    startSelecting = (id) => {      
        this.setState( prevState => ({ 
                table: {...prevState.table}, 
                selection: {
                  selectedCells: [id],
                  pressed: true,
                  start: id,
                  end: id 
                }
              })
          );       
    // (id) => {
    //   let newSelection = id;
    //   let newSelectionArray;
   
    //   if(this.state.selectedCells.indexOf(newSelection) > -1) {
    //     newSelectionArray = this.state.selectedCells.filter(s => s !== newSelection)
    //   } else {
    //     newSelectionArray = [...this.state.selectedCells, newSelection];
    //   }
   
    //     this.setState( prevState => ({ 
    //       table: {...prevState.table}, 
    //       selectedCells: newSelectionArray,
    //       pressed: true 
    //     })
    //     )       
    }

    continueSelecting = (id) => {
      if (this.state.selection.pressed && this.state.selection.start !== id ){
        let newSelectionArray = this.getSelectedCells(this.state, this.state.selection.start, id)
        this.setState( prevState => ({ 
          table: {...prevState.table}, 
          selection: {
            selectedCells: newSelectionArray,
            pressed: true,
            start: prevState.selection.start,
            end: id 
          }
        }));  
      }        
    }

    getSelectedCells = (data, start, end) => {
      var selected = [];
      let range = this.range
      range(start.charCodeAt(0), end.charCodeAt(0)).map((_col) => {
        range(+start[1], +end[1]).map((row) => {
          let col = String.fromCharCode(_col)
          // console.log("col, row", col, row, data[col][row])
          // if (data[col] && data[col][row]) {
            selected.push((col+row));
          // }
        });
      });
      return selected;
    }

    range = (start, end) => {
      var array = [];
      var inc = end - start > 0;
      for (var i = start; inc ? i <= end : i >= end; inc ? i++ : i--) {
        inc ? array.push(i) : array.unshift(i);
      }
      return array;
    };

    stopSelecting = () => {
        
        this.setState( prevState => ({ 
          table: {...prevState.table}, 
          selection: {
            ...prevState.selection,
            pressed: false,            
          }
        }));  
    }    
    
    calculateValue= (state, formula) => {
      let _value = null
      let updatedFormula = ""
      console.log("formula", formula, typeof formula)
          if(formula.charAt(0) !== '='){ 
            console.log("value=formula", formula, typeof formula)        
            return {formula: formula,
                    value: formula}            
          } else {
            try {
              console.log("eval", formula, typeof formula)
              let divNull = formula.search(/\/(?=0)+/g)
              if (divNull > 0)
                return {formula: formula,
                  value: '#DIV/0!'};
              let notProperSymbols = formula.search(/[^*/+=()\-0-9A-Z]+/g)
              if (notProperSymbols > 0)
                return {formula: formula,
                  value: '#NAME?'};
              let matches = formula.match(/[A_Z][1-9]+/g) || []
              console.log("matches", matches)
              if (matches){
                matches.forEach(match => {
                  let foundValue = state[match[0]][match[1]].value
                  console.log("foundValue", foundValue)
                  return updatedFormula = formula.replace(match, foundValue)
                })
                console.log("updatedFormula", updatedFormula)  
                let operation = formula.substr(1,3)
                let operationFormula = null
                switch(operation){
                  case ('sum'): {
                    operationFormula = formula.slice(4).split(';').join('+')
                    _value = eval(operationFormula)
                    break
                  }
                  case ('dif'): {
                    operationFormula = formula.slice(5).split(';').join('-')
                    _value = eval(operationFormula)
                    break
                  }
                  case ('pro'): {
                    operationFormula = formula.slice(5).split(';').join('*')
                    _value = eval(operationFormula)
                    break
                  }
                  case ('quo'): {
                    operationFormula = formula.slice(5).split(';').join('/')
                    _value = eval(operationFormula)
                    break
                  }
                  default: _value = eval(updatedFormula.substring(1))
                }
              } else _value = eval(formula.substring(1))
              console.log("_value", _value)
              return {formula: formula,
                      value: _value}
            } catch(e) {
                return {formula: formula,
                  value: "error",
                  className: 'cell-error'}
                }
            }   
    }
  
    cellUpdate = (state, changedCell, formula) => {
      let id = "" + changedCell.id
      console.log("id", id)    
      let upDatedCell = Object.assign(
        {}, changedCell, this.calculateValue(state, formula))
      console.log("stateCopy", state, id[0] )
      console.log("upDatedCell", upDatedCell )
      if (state[id[0]] == undefined) 
        state[id[0]]={};
      state[id[0]][id[1]] = upDatedCell      
  
      for (var row in state){
        // console.log("row", row, state[row])      
        for (var item in state[row]){          
          let currentItem = state[row][item]
          // console.log("item", item, state[row][item])
          if (currentItem.formula.charAt(0) === '=' &&
            currentItem.formula.indexOf(changedCell.id) > -1 &&
            currentItem.id !== changedCell.id )
              state = this.cellUpdate( state, currentItem, currentItem.formula)
        }
      }
      return state
    }
  
    updateState = (_currentCell, _formula) => {
      console.log("first cell", _currentCell)
      let prevState = JSON.parse(JSON.stringify(this.state.table));
      let formula = "" + _formula
    //   for (var row in prevState){
    //     console.log("row", row, prevState[row])      
    //     for (var item in prevState[row]){          
    //       let currentItem = prevState[row][item]
    //       console.log("item", item, prevState[row][item])
    //      this.cellUpdate(prevState, currentItem, currentItem.formula)
    //     }
    //   }
      
      let newState = this.cellUpdate(prevState, _currentCell, formula);
      console.log("newState", newState)
      this.setState (prevstate => ({
        ...prevstate,
        table: newState
      }))
    }

    cellTable = ( colStart, colEnd, rowStart, rowEnd) => {
      let arrayOfRows = []    
      for ( let x = rowStart; x <= rowEnd; x++ ){
          let arrayOfCells = []
          for (let y = colStart.charCodeAt(0); y <= colEnd.charCodeAt(0); y++){
              let interCell = {}              
                Object.assign(interCell, {x: x, y: String.fromCharCode(y) }) 
              arrayOfCells.push(interCell)
          }
          arrayOfRows.push(arrayOfCells)
      }
      // console.log(arrayOfRows)
      return arrayOfRows
    }

  
    render(){
      console.log("render state", this.state)

      let data = this.cellTable("@", "D", 0, 5) 
      let list = data.map((item, i)=> {
              return (
                  <tr key={i} >
                      {item.map(cell => {                        
                        let {x, y} = cell
                        let key = y+x
                        let initialCell = {                          
                            id: y+x,
                            x: x,
                            y: y,
                            value: null,
                            formula: null,
                            className: 'cell-title'                          
                        }          
                        if (x == 0)
                          return (
                              <Cell key={key}                              
                              cellFromState={
                               {
                                  ...initialCell,
                                  value: y == "@" ? "" : y,
                                  className: 'cell-title'
                                } }                              
                              />
                          )
                        else if (y == "@")
                        return(
                          <Cell key={key}                          
                          cellFromState={
                           {
                              ...initialCell,
                              value:  x ,
                              className: 'cell-title'                              
                            } }                              
                          />
                        )
                        else return (
                          <Cell key={key} 
                          update={this.updateState}
                          startSelecting = {this.startSelecting}
                          continueSelecting = {this.continueSelecting}
                          stopSelecting = {this.stopSelecting}
                          isFirst = {this.state.selection.start === key}
                          active = {this.state.selection.selectedCells.some(x => x == key)}
                          cellFromState={
                            this.state.table[y] !== undefined && this.state.table[y][x] !== undefined? 
                            this.state.table[y][x] : {
                              ...initialCell,
                              value: '' ,
                              formula: '',
                              className: 'cell'
                            } }                              
                          />
                        )
                      })}
                  </tr>
              )
          }        
      )
      
        return (
          <div className="wrapper" >
          < ControlsContainer update={this.updateState} />
              <table className='table' >
                  <tbody>{list}</tbody>
              </table>
          </div>
        )  
    }
}
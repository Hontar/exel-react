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
        },
        selectionInFormula: {
          selectedCells: [],
          pressed: false,
          start: null,
          end: null
        },
        currentCell: {
          id: null, 
          isEdited: false
        }               
      }
    }

    enableEditing = (id, flag) => {
      let newSelectionObj = {
        selectedCells: [],
        pressed: false,
        start: null,
        end: null 
      }  
      this.setState( prevState => ({ 
        ...prevState,       
        selectionInFormula: newSelectionObj,
        currentCell: {
          id: id, 
          isEdited: flag
        }  
      })
    )}

    startSelecting = (id) => {
      console.log("this state start selecting", id)
      let flag = this.state.currentCell.isEdited  
      let newSelectionObj = {
        selectedCells: [id],
        pressed: true,
        start: id,
        end: id 
      }   
      if (id !== this.state.currentCell.id)
      this.setState( prevState => ({ 
              table: {...prevState.table}, 
              selection: flag ? {...prevState.selection} : newSelectionObj,
              selectionInFormula: flag ? newSelectionObj : {...prevState.selectionInFormula},
              currentCell: {...prevState.currentCell}  
            })
        )       
    }

    continueSelecting = (id) => {
      let kindOfSelection = this.state.currentCell.isEdited ? "selectionInFormula" : "selection"
      

      if (this.state[kindOfSelection].pressed && this.state[kindOfSelection].start !== id ){
        console.log("start id", id, kindOfSelection, this.state[kindOfSelection].pressed, this.state.selection.start, this.state.selectionInFormula.start )
        let newSelectionArray = this.getSelectedCells(this.state[kindOfSelection].start, id)
        console.log("selected array", newSelectionArray)
        this.setState( prevState => ({
          ...prevState, 
          table: {...prevState.table}, 
          [kindOfSelection]: {
            selectedCells: newSelectionArray,
            pressed: true,
            start: prevState[kindOfSelection].start,
            end: id 
          }
        }));  
      }        
    }

    getSelectedCells = (start, end) => {
      var selected = [];
      let range = this.range
      range(start.charCodeAt(0), end.charCodeAt(0)).map((_col) => {
        range(+start[1], +end[1]).map((row) => {
          let col = String.fromCharCode(_col)        
            selected.push((col+row));
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
          ...prevState,
          table: {...prevState.table}, 
          selection: {
            ...prevState.selection,
            pressed: false,            
          },
          selectionInFormula: {
            ...prevState.selectionInFormula,
            pressed: false,            
          }
        }));  
    }    
    
    calculateValue= (state, formula) => {
      let _value = null
      let stringCell = {
        formula: formula,
        value: formula,
        className: 'cell left'
      }
     
      console.log("formula", formula, typeof formula, formula.charAt(0))
          if(formula.charAt(0) === "'"){ 
            console.log("value '", formula, typeof formula)        
            return {...stringCell,
                    value: formula.substring(1)
                    } 
          } else if(formula.charAt(0) === '"' || formula.charAt(0) === "`"){ 
            console.log("value " , formula, typeof formula)        
            return {...stringCell} 
          }  else if (formula.charAt(0) === "="){
            try {
              formula = formula.toUpperCase()
              let updatedFormula = formula
              
              console.log("eval", formula, typeof formula)
              let divNull = formula.search(/\/(?=0)+/g)
              if (divNull > 0)
                return {formula: formula,
                  value: '#DIV/0!',
                  className: 'cell-error'};
              let notProperSymbols = formula.search(/[^*/+=() \-0-9A-Z]+/g)
              if (notProperSymbols > 0)
                return {formula: formula,
                  value: '#NAME?',
                  className: 'cell-error'};
              let matches = formula.match(/[A-Z][1-9]+/g) || []
              console.log("matches", matches)
              if (matches.length){
                matches.forEach(match => {
                  let foundValue = state[match[0]] && 
                                  state[match[0]][match[1]] && 
                                  state[match[0]][match[1]].value ? 
                                  state[match[0]][match[1]].value : '0'
                  console.log("foundValue", foundValue)
                  updatedFormula = updatedFormula.replace(match, foundValue)
                })
                console.log("updatedFormula", updatedFormula)
                _value = eval(updatedFormula.substring(1)) 
                return {formula: formula,
                  value: _value,
                  className: 'cell'}
                // let operation = formula.substr(1,3)
                // let operationFormula = null
                // switch(operation){
                //   case ('sum'): {
                //     operationFormula = formula.slice(4).split(';').join('+')
                //     _value = eval(operationFormula)
                //     break
                //   }
                //   case ('dif'): {
                //     operationFormula = formula.slice(5).split(';').join('-')
                //     _value = eval(operationFormula)
                //     break
                //   }
                //   case ('pro'): {
                //     operationFormula = formula.slice(5).split(';').join('*')
                //     _value = eval(operationFormula)
                //     break
                //   }
                //   case ('quo'): {
                //     operationFormula = formula.slice(5).split(';').join('/')
                //     _value = eval(operationFormula)
                //     break
                //   }
                //   default: _value = eval(updatedFormula.substring(1))
                // }
              } else _value = eval(formula.substring(1))
              console.log("_value", _value)
              return {formula: formula,
                      value: _value,
                      className: 'cell'}
            } catch(e) {
                return {formula: formula,
                  value: "error",
                  className: 'cell-error'}
                }
            }  else if(formula.charAt(0) !== '=' && isNaN(formula.charAt(0))){ 
              console.log("value=formula", formula, typeof formula)        
              return {...stringCell}            
            } else if(formula.charAt(0) !== '=' ){ 
              console.log("value=formula", formula, typeof formula)        
              return {...stringCell,
                      className: 'cell'
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
      let selectedArray = this.state.selectionInFormula.selectedCells
      let enableSelectedArray = this.state.currentCell.isEdited

      let data = this.cellTable("@", "F", 0, 9) 
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
                          enableEditing = {this.enableEditing}
                          isSelected = {this.state.selection.selectedCells.pressed}
                          isEdited = {this.state.currentCell.isEdited}
                          startSelecting = {this.startSelecting}
                          continueSelecting = {this.continueSelecting}
                          stopSelecting = {this.stopSelecting}
                          isFirst = {this.state.selection.start === key}
                          active = {!this.state.currentCell.isEdited && this.state.selection.selectedCells.some(x => x == key)}
                          isSelected = {this.state.currentCell.isEdited && this.state.selectionInFormula.selectedCells.some(x => x == key)}
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
          < ControlsContainer update={this.updateState} enableSelectedArray = {enableSelectedArray} selectedArray = {selectedArray} />
              <table className='table' >
                  <tbody>{list}</tbody>
              </table>
          </div>
        )  
    }
}
import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as actions from "../actions/table";
import { withRouter } from 'react-router-dom'

import ControlsContainer from './Controlscontainer';

import Cell from '../components/Cell';

class MathTable extends Component {
    constructor(props){
      super(props)
      this.state = {
        table: {          
        },
        selection: {
          selectedCells: [],
          pressed: false,
          startX: null,
          startY: null,
          endX: null,
          endY: null
        },
        selectionInFormula: {
          selectedCells: [],
          pressed: false,
          startX: null,
          startY: null,
          endX: null,
          endY: null
        },
        currentCell: {
          id: null, 
          isEdited: false
        },
        counter: 0               
      }    
      
      // this.defaultState = {
      //   table: {          
      //   },
      //   selection: {
      //     selectedCells: [],
      //     pressed: false,
      //     startX: null,
      //     startY: null,
      //     endX: null,
      //     endY: null
      //   },
      //   selectionInFormula: {
      //     selectedCells: [],
      //     pressed: false,
      //     startX: null,
      //     startY: null,
      //     endX: null,
      //     endY: null
      //   },
      //   currentCell: {
      //     id: null, 
      //     isEdited: false
      //   }               
      // }
    }

    componentDidUpdate = (prevProps, prevState) => {      
      let {table, id, saveItem, updateItem } = this.props
      console.log("item", typeof item)
      if ( table && table !== prevProps.table ){
      console.log("table", table)      
        this.setState( prevState => ({ 
          ...prevState,       
          table: table,
          counter: 2          
        }))
      } 
      console.log("mathtable didupdate counter", prevState.counter, this.state.counter, prevState, this.state)
      if (prevState.counter == 0 && this.state.counter == 1 && prevState.table !== this.state.table){
        console.log("table changed")
        saveItem({
          title: "Untitled",        
          // item: (+new Date).toString(16).substr(4),
          table: {...this.state.table}          
        })
        this.props.history.push(`/${id}`)
      } else if(this.state.counter > 0 && this.state.counter < 10 && prevState.table !== this.state.table){
        console.log("pass update", this.state.table)
      } else if( this.state.counter === 10 && prevState.counter !== this.state.counter){
        console.log("can update", id, this.state.table)
        updateItem({table: this.state.table}, id)
      }
    } 

    enableEditing = (id, flag) => {
      let newSelectionObj = {
        selectedCells: [],
        pressed: false,
        startX: null,
        startY: null,
        endX: null,
        endY: null 
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

    startSelecting = (_x, _y) => {
      console.log("this state start selecting", _y+_x)
      let flag = this.state.currentCell.isEdited  
      let newSelectionObj = {
        selectedCells: [(_y+_x)],
        pressed: true,
        startX: _x,
        startY: _y,
        endX: _x,
        endY: _y 
      } 

      if (_y+_x !== this.state.currentCell.id)
      this.setState( prevState => ({ 
              ...prevState, 
              selection: flag ? {...prevState.selection} : newSelectionObj,
              selectionInFormula: flag ? newSelectionObj : {...prevState.selectionInFormula},
              currentCell: {...prevState.currentCell}  
            })
        )       
    }

    continueSelecting = (_x, _y) => {
      let kindOfSelection = this.state.currentCell.isEdited ? "selectionInFormula" : "selection"    

      if (this.state[kindOfSelection].pressed && this.state[kindOfSelection].startX !== _x && this.state[kindOfSelection].startX !== _y ){
        console.log("start id",_y+_x, kindOfSelection, this.state[kindOfSelection].pressed, this.state.selection.start, this.state.selectionInFormula.start )
        let newSelectionArray = this.getSelectedCells(this.state[kindOfSelection].startX, this.state[kindOfSelection].startY, _x, _y)
        console.log("selected array", newSelectionArray)
        this.setState( prevState => ({
          ...prevState,           
          [kindOfSelection]: {
            selectedCells: newSelectionArray,
            pressed: true,
            startX: prevState[kindOfSelection].startX,
            startY: prevState[kindOfSelection].startY,
            endX:  _x, 
            endY: _y 
          }
        }));  
      }        
    }

    getSelectedCells = (startX, startY, endX, endY) => {
      var selected = [];
      let range = this.range
      range(startY.charCodeAt(0), endY.charCodeAt(0)).map((_col) => {
        range(+startX, +endX).map((row) => {
          let col = String.fromCharCode(_col)
            selected.push((col+row));
        });
      });
      console.log("getSelectedCells", selected)
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
    
    calculateValue = (state, formula) => {
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
              
              let notProperSymbols = formula.search(/[^*/+=() :\-0-9A-Z]+/g)
              if (notProperSymbols > 0)
                return {formula: formula,
                  value: '#NAME?',
                  className: 'cell-error'};

              let rangeMatch = formula.search(/(=\s*SUM|=\s*DIFF|=\s*PROD|=\s*QUOT)\s*[A-Z][0-9]+\s*:\s*[A-Z][0-9]+/g) >= 0
              console.log("rangeMatch", rangeMatch)
                if (rangeMatch){
                  let start = formula.match(/[A-Z][0-9]/g)[0]                  
                  let end = formula.match(/[A-Z][0-9]/g)[1]
                  let startX = start.slice(1)
                  let endX = end.slice(1)
                  let arrFromState = this.getSelectedCells(startX, start[0], endX, end[0])
                  console.log("arrFromState", arrFromState)
                  
                  let arrOfValues = []
                  arrFromState.forEach(item => {
                    let cellX = item.slice(1)
                    let foundValue = state[item[0]] && 
                                    state[item[0]][cellX] && 
                                    state[item[0]][cellX].value ? 
                                    +state[item[0]][cellX].value : 0
                    console.log("arrOfValues", arrOfValues)
                    arrOfValues.push(foundValue)
                  })
                  console.log("arrOfValues", arrOfValues)
                  
                  let operation = formula.substr(1,3).toLowerCase()
                  console.log("operation", operation)
                  switch(operation){
                      case ('sum'): { 
                        console.log("sum")                       
                        _value = arrOfValues.reduce((prevValue, currentValue) => 
                          prevValue + currentValue
                        )
                        console.log("sum", _value)
                        break
                      }
                      case ('dif'): {
                        _value = arrOfValues.reduce((prevValue, currentValue) => 
                          prevValue - currentValue
                        )
                        break
                      }
                      case ('pro'): {
                        _value = arrOfValues.reduce((prevValue, currentValue) => 
                          prevValue * currentValue
                        )
                        break
                      }
                      case ('quo'): {
                        _value = arrOfValues.reduce((prevValue, currentValue) => 
                          prevValue / currentValue
                        )
                        break
                      }
                      default: _value = eval(updatedFormula.substring(1))
                    }
                    console.log("sum res", _value)
                    return {formula: formula,
                      value: _value,
                      className: 'cell'}
                }

              let matches = formula.match(/[A-Z][1-9]+/g) || []
              console.log("matches", matches)
              if (matches.length){
                matches.forEach(match => {
                  let cellX = match.slice(1)
                  let foundValue = state[match[0]] && 
                                  state[match[0]][cellX] && 
                                  state[match[0]][cellX].value ? 
                                  state[match[0]][cellX].value : '0'
                  console.log("foundValue", foundValue)
                  updatedFormula = updatedFormula.replace(match, foundValue)
                })
                console.log("updatedFormula", updatedFormula)
                _value = eval(updatedFormula.substring(1)) 
                return {formula: formula,
                  value: _value,
                  className: 'cell'}                
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
      let cellX = id.slice(1)
      if (state[id[0]] === undefined) 
        state[id[0]]={};
      state[id[0]][cellX] = upDatedCell      
  
      for (var row in state){
        for (var item in state[row]){          
          let currentItem = state[row][item]
          if (currentItem.formula.charAt(0) === '=' &&
            currentItem.formula.indexOf(changedCell.id) > -1 &&
            currentItem.id !== changedCell.id ){
              state = this.cellUpdate( state, currentItem, currentItem.formula)
          } else if (currentItem.id !== changedCell.id &&
            currentItem.formula.search(/(=\s*SUM|=\s*DIFF|=\s*PROD|=\s*QUOT)/g) >= 0) 
              state = this.cellUpdate( state, currentItem, currentItem.formula) 
        }
      }
      return state
    }
  
    updateState = (_currentCell, _formula) => {
      console.log("first cell", _currentCell, _formula)
      if (!_formula) return;
      let prevState = JSON.parse(JSON.stringify(this.state.table));
      let formula = "" + _formula      
      let newState = this.cellUpdate(prevState, _currentCell, formula);
      console.log("newState", newState, prevState, this.state.table)
      if ( newState !== this.state.table){
         console.log("newState +counter", newState)
        this.setState (prevstate => ({
          ...prevstate,
          table: newState,
          counter: prevstate.counter === 10 ? 1 : prevstate.counter + 1
        }))
      }     
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
      return arrayOfRows
    }

  
    render(){
      console.log("render state", this.state)
      let { selection, currentCell, selectionInFormula } = this.state
      let _selectionRange = {
        start: {
          x: selectionInFormula.startX,
          y: selectionInFormula.startY
        }, 
        end: {
          x: selectionInFormula.endX,
          y: selectionInFormula.endY
        }}

      let data = this.cellTable("@", "F", 0, 10) 
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
                              isEdited = {currentCell.isEdited}                             
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
                          isEdited = {currentCell.isEdited}                              
                          />
                        )
                        else return (
                          <Cell 
                            key={key} 
                            update={this.updateState}
                            enableEditing = {this.enableEditing}
                            isSelected = {selection.selectedCells.pressed}
                            isEdited = {currentCell.isEdited}
                            startSelecting = {this.startSelecting}
                            continueSelecting = {this.continueSelecting}
                            stopSelecting = {this.stopSelecting}
                            isFirst = {selection.startX && ((selection.startY + selection.startX) === key)}
                            active = {!currentCell.isEdited && selection.selectedCells.some(x => x == key)}
                            isSelected = {currentCell.isEdited && selectionInFormula.selectedCells.some(x => x == key)}
                            selectionRange = {_selectionRange}
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
            <ControlsContainer 
              update={this.updateState}
              enableArray = {currentCell.isEdited}           
              selectionRange = {_selectionRange} 
            />
            <div className='table-box' >
              <table className='table' >
                  <tbody>{list}</tbody>
              </table>
            </div>
          </div>
        )  
    }
}

const mapStateToProps = state => {
	return {
        id: state.table.id,		
		    table: state.table.table		
	};
};
const mapDispatchToProps = dispatch => bindActionCreators({ ...actions }, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(MathTable));
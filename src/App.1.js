import React, { Component } from 'react';
import './App.css';

import {createStore, combineReducers, applyMiddleware} from "redux";

// import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';



let currentCellReducer = (state, action) => {
  if (state === undefined){
    return {
      // id: null,
      formula: ''
      // value: null
    }
  }
  if (action.type === 'CELL_CURRENT'){
    return {
      // id: action.id,
      formula: action.formula,
      // value: action.value
    }
  }
  if (state === 'CELL_CLEAR'){
    return {
      // id: null,
      formula: '',
      // value: null
    }
  }
}

const reducers = combineReducers({
  currentCellReducer: currentCellReducer  
})

const store = createStore(reducers)

class ShowBar extends Component {
  // constructor(props){
    // super(props)
    // this.state = {
      // id: this.props.cell.id,
      // formula: this.props.cell.formula,
      // value: this.props.cell.value
    // }
  // }

  sendFormula = () => this.props.onSend(this.inputCell.value )
  clearField = () => this.inputCell.value = ''

  render(){
    console.log("render input", this.props.cell.formula)
    return (
      <div>
        <span name='id'> 
          {/* {this.state.id} */}
        </span>
        <span> 
          f
        </span>
        <input name='formula'
          type='text'
          value={this.props.cell.formula}
          ref={c => this.inputCell = c}
          onChange={this.sendFormula} 
          onBlur={this.clearField}
        />
      </div>
    )
  }

  static get defaultProps(){
    return {
      cell: {
        id: '',
        formula: '',
        value: ''
      },
      onSend(id, formula, value){
        console.log("onSend isn't set", id, formula, value)
      }
    }
  }
}

ShowBar = connect(state => ({cell: state.currentCellReducer}), {onSend: actionInputCell})(ShowBar)


function actionInputCell (formula) {
  console.log(formula)
  return {type: "CELL_CURRENT",
  formula }
}


class Cell extends Component {
  constructor(props){
    super(props)
    this.state = {
      // id: this.props.cell.id,
      formula: this.props.cell.formula,
      value: this.props.cell.value
    }
  }

  changeFormula = e => {this.setState({formula: e.target.value})}
  changeValue = e => {this.setState({value: e.target.value})}

  sendFormula = () => this.props.onSend(this.currentCell.innerText)

  render(){
    console.log("render cell", this.props.cell, this.props.cell.formula)
    return(
      <div 
      style ={{width: '100px'}}>
        <p 
          contentEditable={this.props.cell.contentEditable}
          ref={c => this.currentCell = c}
          onInput={this.sendFormula}
          // onDoubleClick={this.changeFormula} 
          // onBlur={this.sendFormula}
          > 
            {this.props.cell.formula}
        </p>

      </div>
    )
  } 

  static get defaultProps(){
    return {
      cell: {
        id: '',
        formula: '',
        value: ''
      },
      onSend(id, formula, value){
        console.log("onSend isn't set", id, formula, value)
      }
    }
  }
}

Cell = connect(state => ({cell: state.currentCellReducer}), {onSend: actionInputCell})(Cell)


class MathTable extends Component {
  constructor(props){
    super(props)
    this.state = {
      
    }
  }
  
  generateTable(){
    let rows = [0,1,2,3,4]
    let cols = ['', 'A', 'B', 'C', 'D']
    let defState = {}
    for (var row in rows){
      let interRow = {}
      let interCol = {}
      for (var col in cols){
        let interCell = {}
        if (row == 0 || col == 0){
          Object.assign(interCell, {key: col+row, x: row, y: col, contentEditable: true, value: '', formula: ''})
        } else Object.assign(interCell, {key: col+row, x: row, y: col, contentEditable: false, value: '', formula: ''});   
        Object.assign(interCol, {[col]: interCell})   
      }
      Object.assign(interRow, {[row]: interCol })
      Object.assign(defState, interRow)
      console.log("defState",defState)
    }    
    return defState
  }

  render(){
    this.generateTable()
    return(
      <div>
        <TableContainer table={this.generateTable()}/>
      </div>     
    )
  }
}

class TableContainer extends Component {
  constructor(props){
    super(props)
      this.getCell= this.getCell.bind(this)
    
  }

  getCell(obj){
    let table = []
    for (var row in obj){
      console.log("row", obj[row])
      
        for (var item in obj[row]){
          console.log("item", obj[row][item])
          table.push(obj[row][item])
        }
      
    } 
    console.log("table", table)
    return table
  }

  render(){
    console.log("TableContainer",this.props.table)
    return (
      <div>
        {this.getCell(this.props.table).map(elem =>  {
          return elem.y == 0 ? 
          <><br/> <Cell cell={elem} key={elem.key}/></> 
          : <Cell cell={elem} key={elem.key}/>})}
      </div>
    )
  }
}


store.subscribe(() => console.log(store.getState()))

let App = () =>
<Provider store = {store}>  
  <div className="App">    
    <ShowBar />
    <MathTable />
  </div>
</Provider>


export default App;

import React, { Component } from 'react';

import ControlsContainer from '../containers/controlscontainer';

import Cell from '../containers/cell';

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
        currentCells: []
    }
      this.cellUpdate = this.cellUpdate.bind(this)
    }

    setCurrentCell = (id) => {
        this.setState (prevState => 
            {console.log("cell clicked", id)
            return ({
                table: {...prevState.table},
                currentCells: [...prevState.currentCells, id]
            })}
        ) 
    }

    clearCurrentCell = (e) => {
        console.log("event target", e.target)
        this.setState (prevState => (
            {
                table: {...prevState.table},
                currentCells: []
            }
        )) 
    }
  
    getCell(obj){
      let table = []
      for (var row in obj){        
          for (var item in obj[row]){
            table.push(obj[row][item])
          }        
      } 
      console.log("table", table)
      return table
    }
  
    
    calculateValue= (state, id, formula) => {
      let _value = null
      let updatedFormula = ""
      console.log("formula", formula, typeof formula)
          if(formula.charAt(0) !== '='){ 
            console.log("value=formula", formula, typeof formula)        
            return {formula: formula,
                    value: formula}
            
          } else {
            try {console.log("eval", formula, typeof formula)
                let matches = formula.match(/[A_Z][1-9]+/g) || []
                console.log("matches", matches)
                matches.forEach(match => {
                  let foundValue = state[match[0]][match[1]].value
                  return updatedFormula = formula.replace(match, foundValue)
                })
                            
                _value = eval(updatedFormula.substring(1))
                return {formula: formula,
                        value: _value}
              } 
              catch(e) {
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
        {}, changedCell, this.calculateValue(state, changedCell.id, formula))
      console.log("stateCopy", state, id[0] )
      console.log("upDatedCell", upDatedCell )
      state[id[0]][id[1]] = upDatedCell
      
  
      for (var row in state){
        console.log("row", row, state[row])      
        for (var item in state[row]){          
          let currentItem = state[row][item]
          console.log("item", item, state[row][item])
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
  
    // componentDidMount(){
    //     this.updateState({
    //     id: "B3",
    //     x: 3,
    //     y: 'B',
    //     formula: '=3+A1',
    //     value: null
    //     }, "=3+A1")
    // }


    // cellRange = ( colStart, colEnd, rowStart, rowEnd) => {
    //   let array = []
    //   for (let y = colStart.charCodeAt(0); y <= colEnd.charCodeAt(0); y++){
    //     for ( let x = rowStart; x <= rowEnd; x++ ){
    //       array.push(String.fromCharCode(y) + x )
    //     }
    //   }
    //   return array
    // }

    cellRange = ( colStart, colEnd, rowStart, rowEnd) => {
      let arrayOfRows = []    
      for ( let x = rowStart; x <= rowEnd; x++ ){
          let arrayOfCells = []
          for (let y = colStart.charCodeAt(0); y <= colEnd.charCodeAt(0); y++){
              let interCell = {}
              if (x == 0 ){
                  Object.assign(interCell, {id: String.fromCharCode(y) + x })
                      
              } else if (y == 64){
                Object.assign(interCell, {id: String.fromCharCode(y) + x })
              } else Object.assign(interCell, {id: String.fromCharCode(y) + x});   
              arrayOfCells.push(interCell)
          }
          arrayOfRows.push(arrayOfCells)
      }
      console.log(arrayOfRows)
      return arrayOfRows
    }

  
    render(){
      console.log("render state", this.state)

      let data = this.cellRange("@", "D", 0, 5) 
      let list = data.map((item, i)=> {
              return (
                  <tr key={i} >
                      {item.map(cell => {                        
                        let elem = cell.id
                        if (elem[1] == 0)
                          return (
                              <Cell key={cell.id}                              
                              cellFromState={
                               {
                                  id: elem,
                                  x: +elem[1],
                                  y: elem[0],
                                  value: elem[0],
                                  className: 'cell-title'
                                } }                              
                              />
                          )
                        else if (elem[0] == "@")
                        return(
                          <Cell key={cell.id}                          
                          cellFromState={
                           {
                              id: elem,
                              x: +elem[1],
                              y: elem[0],
                              value:  elem[1] ,
                              className: 'cell-title'                              
                            } }                              
                          />
                        )
                        else return (
                          <Cell key={cell.id} 
                          update={this.updateState}
                          cellFromState={
                            this.state.table[elem[0]] !== undefined && this.state.table[elem[0]][+elem[1]] !== undefined? 
                            this.state.table[elem[0]][+elem[1]] : {
                              id: elem,
                              x: +elem[1],
                              y: elem[0],
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

            // <div className="table" >
            //     { this.cellRange("A", "D", 0, 3).map(elem =>  {
            //         console.log("current cell", elem[0], elem[1], typeof +elem[1])
            //         if (this.state.table[elem[0]] !== undefined && this.state.table[elem[0]][+elem[1]] !== undefined)
            //         console.log("in state defined", elem);
            //         return (
            //             <Cell 
            //                 key={elem} id = {elem}                             
            //                 update={this.updateState}
            //                 cellFromState={
            //                   this.state.table[elem[0]] !== undefined && this.state.table[elem[0]][+elem[1]] !== undefined? 
            //                   this.state.table[elem[0]][+elem[1]] : {
            //                     id: elem,
            //                     x: +elem[1],
            //                     y: elem[0],
            //                     value: '',
            //                     formula: ''
            //                   } }
            //                 formula={this.state.table[elem[0]] !==undefined && this.state.table[elem[0]][+elem[1]]!==undefined ? 
            //                     this.state.table[elem[0]][+elem[1]].formula : ""}
            //                 value={this.state.table[elem[0]]!==undefined && this.state.table[elem[0]][+elem[1]]!==undefined ? 
            //                     this.state.table[elem[0]][+elem[1]].value : ""} /> 
            //         )}
            
            //     )}
            // </div>
        )
  
    }
}
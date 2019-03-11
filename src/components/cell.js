import React, { Component } from 'react';
// import InputComponent from "./controls";

import { connect } from 'react-redux';

import {actionInputCell, actionCellClear} from "../actions/acs";

class Cell extends Component {
    constructor(props){
      super(props)
      this.state = {      
        showInput: false
      }
      this.defaultCell = {
        id: this.props.cellFromState.id,
        x: this.props.cellFromState.x,
        y: this.props.cellFromState.y,
        formula: this.props.cell.formula
      }
      this.currentCell = React.createRef()
    }  

    
    changeFormula = (e) => {  
      e.preventDefault()
      const {update, cellFromState, isEdited} = this.props
      // console.log("input",  this.currentCell, this.currentCell.current.value,this.props.isEdited ) 
      if ( !isEdited) {
        // if(this.currentCell.value !== this.defaultCell.formula){
          update( cellFromState, this.currentCell.current.value);
          this.setState(prevstate => 
            ({ ...prevstate, showInput: !prevstate.showInput})
          )
          this.currentCell.current.blur()
        // }
      } else {
        this.currentCell.current.focus()} 
    }

    changeFormulaKeyboard = (e) => {  
      const {onSend, cellFromState, enableEditing, update} = this.props
      onSend(this.defaultCell.id, this.currentCell.current.value, cellFromState)     
      let enableRange = this.currentCell.current.value.toUpperCase().search(/(=\s*SUM|=\s*DIFF|=\s*PROD|=\s*DIV)\s*\(\s*/g) >= 0
      if( enableRange ){
        // console.log("enableEditing" )
        enableEditing(this.defaultCell.id, true) 
      } 
      // else if (this.currentCell.current.value.charAt(0) === "="){
      //   console.log("enableEditing" )
      //   this.props.enableEditing(this.defaultCell.id, true) 
      //   console.log("continue" )
      // }
      if (e.key === 'Enter' ){
        // console.log("enter")
        update( cellFromState, this.currentCell.current.value);
        enableEditing(this.defaultCell.id, false)  
        this.setState(prevstate => 
          ({ ...prevstate, showInput: !prevstate.showInput})
        ) 
      } else {
        // console.log("focus")
        onSend(this.defaultCell.id, this.currentCell.current.value, cellFromState)
      } 
    }

    changeCellView = () => {  
      this.setState(prevstate => 
        ({ ...prevstate, showInput: !prevstate.showInput})
      )      
    }

    setCurrent = () => {
      const {cellFromState, isEdited, actionCellClear, onSend} = this.props
      if (cellFromState.className === "cell-title" && !isEdited){
        actionCellClear()
        return
      } 
      if (!isEdited)
        onSend(this.defaultCell.id, cellFromState.formula, cellFromState);      
    }

    startSelecting = () => { 
      // console.log("start selecting cell", this.defaultCell.id)     
      this.props.startSelecting(this.defaultCell.x, this.defaultCell.y)
    }
    continueSelecting = () => {      
        // console.log("continue selecting cell", this.defaultCell.id)     
        this.props.continueSelecting(this.defaultCell.x, this.defaultCell.y);      
    }
    stopSelecting = () => {
      // console.log("stop selecting") 
      this.props.stopSelecting();     
    }

    
    shouldComponentUpdate(nextProps, nextState, nextContext) {               
        if(nextProps.cellFromState.value !== this.props.cellFromState.value)
          return true;
        if(nextProps.active !== this.props.active || nextProps.isSelected !== this.props.isSelected)
          return true;
        if(nextProps.cell.id !== this.props.cellFromState.id) 
          return false; 
        return true
    }

    componentDidUpdate(prevProps, prevState) {
      let {selectionRange} = this.props
      const enabledInput = this.currentCell.current
      const endOfInput = /(\+|\-|\:|\*)$/g
      if ( selectionRange && selectionRange !== prevProps.selectionRange ){
        // console.log("range in input satrt")
        let {start, end} = prevProps.selectionRange
        if (this.state.showInput){
          // console.log("range in input mutation", this.currentCell.current.value)
          let enableRange = this.currentCell.current.value.toUpperCase().search(/(=\s*SUM|=\s*DIFF|=\s*PROD|=\s*DIV)\s*\(\s*/g) >= 0         
          let prevValue = this.currentCell.current.value.toUpperCase().match(/(=\s*SUM|=\s*DIFF|=\s*PROD|=\s*DIV)/g) || "="        
          if (this.currentCell.current && enableRange && start.x){ 
            // console.log("enableRange", enableRange)
            // console.log("range in input cruitios update", prevValue, this.currentCell.current.value )
            if (start.x === end.x && start.y === end.y) {
              this.currentCell.current.value = `${prevValue} (${start.y + start.x} `
            } else this.currentCell.current.value = `${prevValue} (${start.y + start.x} : ${end.y + end.x})`              
            // this.props.onSend(this.defaultCell.id, this.currentCell.current.value, this.props.cellFromState)
          } else if (enabledInput && enabledInput.value.charAt(0) === "=" && endOfInput.test(enabledInput.value) && start.x) {
            enabledInput.value += `${start.y + start.x}`
          }
        }
      }      
    }
  
    render(){
      const { isFirst, active, isSelected, cellFromState} = this.props
      let {showInput} = this.state
      let selected 
      if(isFirst)
        selected = "first";
      else if(active ) 
        selected = "selected";
      else if(isSelected) 
        selected = "selected-formula";
      else 
        selected = cellFromState.className;
      // console.log("render cell", this.props)
      return(
        <td 
            className={`table_cell ${selected}`}
            onClick = {this.setCurrent}
            onMouseDown = {this.startSelecting}
            onMouseEnter = {this.continueSelecting}
            onMouseUp = {this.stopSelecting}
            onDoubleClick = {this.changeCellView}
            >   
            {showInput && 
            <input 
                    className='table-cell input'
                    style = {{display: showInput ? "inline-block" : "none"}}
                    autoFocus = {true}
                    defaultValue={cellFromState.formula}
                    ref={this.currentCell}
                    onBlur={this.changeFormula}
                    onKeyUp={this.changeFormulaKeyboard}
                /> 
                } 
                <span
                  style = {{display: !showInput ? "inline-block" : "none"}}
                >
                  {cellFromState.value}
                </span>
             
        </td>
      )
    } 
    
  
    static get defaultProps(){
      return {
        cell: {
          id: '',
          formula: ''          
        },
        cellFromState: {
          value: '',
          id: '',
          className: 'cell'
        },
        
        onSend(id, formula){
          console.log("onSend isn't set", id, formula)
        },
        startSelecting(id){
          return null
        },
        continueSelecting(id){
          return null
        },
        stopSelecting(id){
          return null
        }
      }
    }
  }
  
export default connect(state => ({cell: state.cell}), {onSend: actionInputCell, actionCellClear: actionCellClear})(Cell)
  
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

    sendFormula = () => this.props.onSend(this.defaultCell.id, this.currentCell.current.value, this.props.cellFromState)
    
    changeCellFormula = (e) => {  
      e.preventDefault()
      // console.log("input",  this.currentCell, this.currentCell.current.value,this.props.isEdited ) 
      if ( !this.props.isEdited) {
        // if(this.currentCell.value !== this.defaultCell.formula){
          this.props.update( this.props.cellFromState, this.currentCell.current.value);
          // console.log("hide input")  
          this.setState(prevstate => 
            ({ ...prevstate, showInput: !prevstate.showInput})
          )
          this.currentCell.current.blur()
        // }
      } else {
        // console.log("focus")
        this.currentCell.current.focus()} 
    }

    changeCellFormulaKeyboard = (e) => {  
      this.props.onSend(this.defaultCell.id, this.currentCell.current.value, this.props.cellFromState)     
      console.log(e.key, this.currentCell.current.value.charAt(0))  
      let enableRange = this.currentCell.current.value.toUpperCase().search(/(=\s*SUM|=\s*DIFF|=\s*PROD|=\s*QUOT)\s*\(\s*/g) >= 0
      if( enableRange ){
        // console.log("enableEditing" )
        this.props.enableEditing(this.defaultCell.id, true) 
        // console.log("continue" )
      } else if (this.currentCell.current.value.charAt(0) === "="){
        // console.log("enableEditing" )
        this.props.enableEditing(this.defaultCell.id, true) 
        // console.log("continue" )
      }
      if (e.key === 'Enter' ){
        // console.log("enter")
        this.props.update( this.props.cellFromState, this.currentCell.current.value);
        this.props.enableEditing(this.defaultCell.id, false)  
        this.setState(prevstate => 
          ({ ...prevstate, showInput: !prevstate.showInput})
        ) 
      } else {
        // console.log("focus")
        this.props.onSend(this.defaultCell.id, this.currentCell.current.value, this.props.cellFromState)
        this.currentCell.current.focus()
      } 
    }

    changeCellView = () => {  
      this.setState(prevstate => 
        ({ ...prevstate, showInput: !prevstate.showInput})
      )      
    }

    setCurrent = () => {
      if (this.props.cellFromState.className === "cell-title" && !this.props.isEdited){
        // console.log('cell-title')
        this.props.actionCellClear()
        return
      } else if (!this.props.isEdited){
        console.log('SET CURRENT', this.defaultCell.id, this.props.cellFromState.formula, this.props.cellFromState)
        this.props.onSend(this.defaultCell.id, this.props.cellFromState.formula, this.props.cellFromState)
      }
        
      // else { console.log("focus", this.props.isEdited)
      //   this.currentCell.focus()}
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
        let {startNew, endNew} = this.props.selectionRange
        if (this.state.showInput){
          // console.log("range in input mutation", this.currentCell.current.value)
          let enableRange = this.currentCell.current.value.toUpperCase().search(/(=\s*SUM|=\s*DIFF|=\s*PROD|=\s*QUOT)\s*\(\s*/g) >= 0         
          let prevValue = this.currentCell.current.value.toUpperCase().match(/(=\s*SUM|=\s*DIFF|=\s*PROD|=\s*QUOT)/g) || "="        
          if (this.currentCell.current && enableRange && start.x ){ 
            // console.log("enableRange", enableRange)
            // console.log("range in input cruitios update", prevValue, this.currentCell.current.value )
            if (start.x === end.x && start.y === end.y) {
              this.currentCell.current.value = `${prevValue} (${start.y + start.x} )`
            } else this.currentCell.current.value = `${prevValue} (${start.y + start.x} : ${end.y + end.x})`              
            // this.props.onSend(this.defaultCell.id, this.currentCell.current.value, this.props.cellFromState)
          } else if (enabledInput && enabledInput.value.charAt(0) === "=" && endOfInput.test(enabledInput.value) && start.x) {
            enabledInput.value += `${start.y + start.x}`
          }
        }
      }      
    }
  
    render(){
      console.log("CELL", this.props)
      let showInput = this.state.showInput
      let selected 
      if(/*this.props.active &&*/ this.props.isFirst)
        selected = "first";
      else if(this.props.active ) 
        selected = "selected";
      else if(this.props.isSelected) 
        selected = "selected-formula";
      else 
        selected = this.props.cellFromState.className;
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
                    defaultValue={this.props.cellFromState.formula}
                    ref={this.currentCell}
                    // onChange={this.sendFormula}
                    onBlur={this.changeCellFormula}
                    onKeyUp={this.changeCellFormulaKeyboard}
                /> 
                } 
                <span
                  style = {{display: !showInput ? "inline-block" : "none"}}
                >
                {this.props.cellFromState.value}
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
  
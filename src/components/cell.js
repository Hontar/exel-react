import React, { Component } from 'react';
// import InputComponent from "./controls";

import { connect } from 'react-redux';

import {actionInputCell} from "../store/acs";

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
    }  

    sendFormula = () => this.props.onSend(this.defaultCell.id, this.currentCell.value, this.props.cellFromState)
    changeCellFormula = (e) => {  
      e.preventDefault()
      console.log("input",  this.currentCell, this.currentCell.value,this.props.isEdited ) 
      if ( !this.props.isEdited) {
        if(this.currentCell.value !== this.defaultCell.formula){
          this.props.update( this.props.cellFromState, this.currentCell.value);  
          this.setState(prevstate => 
            ({ ...prevstate, showInput: !prevstate.showInput})
          )
          this.currentCell.blur()
        }
      } else {
        console.log("focus")
        this.currentCell.focus()} 
    }
    changeCellFormulaKeyboard = (e) => { 
      console.log(e.key, this.currentCell.value.charAt(0))  
      if(this.currentCell.value.charAt(0) === "="){
        console.log("enableEditing", this.state.continueEdit)
        this.props.enableEditing(this.defaultCell.id, true) 
        console.log("continue", this.state.continueEdit)
      }
      if (e.key === 'Enter' ){
        console.log("enter")
        this.props.update( this.props.cellFromState, this.currentCell.value);
        this.props.enableEditing(this.defaultCell.id, false)  
        this.setState(prevstate => 
          ({ ...prevstate, showInput: !prevstate.showInput, continueEdit: !prevstate.continueEdit})
        ) 
      } else {
        console.log("focus")
        this.props.onSend(this.defaultCell.id, this.currentCell.value, this.props.cellFromState)} 
    }
    changeCellView = () => {  
      this.setState(prevstate => 
        ({ ...prevstate, showInput: !prevstate.showInput})
      )      
    }

    setCurrent = () => {
      console.log('click', this.state.continueEdit)
      if (!this.props.isEdited)
        this.props.onSend(this.defaultCell.id, this.props.cellFromState.formula, this.props.cellFromState)
      // else { console.log("focus", this.props.isEdited)
      //   this.currentCell.focus()}
    }

    startSelecting = () => { 
      // console.log("start selecting cell", this.defaultCell.id)     
      this.props.startSelecting(this.defaultCell.id)
    }
    continueSelecting = () => {      
        // console.log("continue selecting cell", this.defaultCell.id)     
        this.props.continueSelecting(this.defaultCell.id);      
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

    // componentDidUpdate(prevProps, prevState) {
    //   this.currentCell.focus();
    // }
  
    render(){
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
      console.log("render cell", this.props)
      return(
        <td 
            className={`table_cell ${selected}`}
            onClick = {this.setCurrent}
            onMouseDown = {this.startSelecting}
            onMouseEnter = {this.continueSelecting}
            onMouseUp = {this.stopSelecting}
            onDoubleClick = {this.changeCellView}
            >   
            {this.state.showInput && 
            <input 
                    className='table-cell input'
                    style = {{display: showInput ? "inline-block" : "none"}}
                    autoFocus = {true}
                    defaultValue={this.props.cellFromState.formula}
                    ref={c => this.currentCell = c}
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
  
export default connect(state => ({cell: state.cell}), {onSend: actionInputCell})(Cell)
  
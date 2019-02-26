import React, { Component } from 'react';
// import InputComponent from "./controls";

import { connect } from 'react-redux';

import {actionInputCell} from "../store/acs";

class Cell extends Component {
    constructor(props){
      super(props)
      this.state = {
        id: this.props.cellFromState.id,
        formula: this.props.cell.formula,
        value: this.props.cellFromState.value,
        showInput: false,
        selected: this.props.cell.selected,
        pressed: false
      }
    }  

    sendFormula = () => this.props.onSend(this.state.id, this.currentCell.value, this.props.cellFromState)
    changeCellFormula = () => {  
      console.log("input", this.currentCell, this.currentCell.value) 
      if (this.currentCell.value !== this.state.formula)
        this.props.update( this.props.cellFromState, this.currentCell.value);  
      this.setState(prevstate => 
        ({ ...prevstate, showInput: !prevstate.showInput})
      )      
    }
    changeCellView = () => {  
      // console.log("input", this.currentCell, this.currentCell.value)       
      this.setState(prevstate => 
        ({ ...prevstate, showInput: !prevstate.showInput})
      )      
    }

    setCurrent = () => {
      this.props.onSend(this.state.id, this.props.cellFromState.formula, this.props.cellFromState)
    }

    startSelecting = () => {      
      this.props.startSelecting(this.state.id)
    }
    continueSelecting = () => {      
      this.props.continueSelecting(this.state.id);     
    }
    stopSelecting = () => {
      this.props.stopSelecting();     
    }

    
    shouldComponentUpdate(nextProps, nextState, nextContext) {               
        if(nextProps.cellFromState.value !== this.props.cellFromState.value)
          return true;
        if(nextProps.active !== this.props.active)
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
      if(this.props.active && this.props.isFirst)
        selected = "first";
      else if(this.props.active) 
        selected = "selected";
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
                    onChange={this.sendFormula}
                    onBlur={this.changeCellFormula}
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
          console.log("startSelecting isn't set", id)
        },
        continueSelecting(id){
          console.log("continueSelecting isn't set", id)
        },
        stopSelecting(id){
          console.log("stopSelecting isn't set", id)
        }
      }
    }
  }
  
export default connect(state => ({cell: state.currentCellReducer}), {onSend: actionInputCell})(Cell)
  
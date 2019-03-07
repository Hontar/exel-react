import React, { Component } from 'react';
// import { connect } from 'react-redux';

// import {actionInputCell} from "../store/acs";

export default class Input extends Component {
    constructor(props){
      super(props)
      this.state = {
          value: this.props.formula
        // id: this.props.cellFromState.id,
        // formula: this.props.cell.formula,
        // value: this.props.cellFromState.value,
        // showInput: false
      }
    }  

    sendFormula = () => this.props.onSend(this.state.id, this.currentCell.value, this.props.cellFromState)
    changeCell = () => {  
      console.log("input", this.currentCell, this.currentCell.value) 
      if (this.currentCell.value !== this.state.formula)
        this.props.update( this.props.cellFromState, this.currentCell.value);  
      this.setState(prevstate => 
        ({ ...prevstate, showInput: !prevstate.showInput})
      )
      
    }
    setCurrent = () => {
      // this.props.onClick(this.state.id)
      this.props.onSend(this.state.id, this.props.cellFromState.formula, this.props.cellFromState)
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(nextProps.cell.id !== this.props.cellFromState.id) {
            return false
        }
        return true
    }

    componentDidUpdate(prevProps, prevState) {
      this.currentCell.focus();
    }
  
    render(){
      let showInput = this.state.showInput
      console.log("render cell", this.props)
      return(
        <td 
            className={`table_cell ${this.props.cellFromState.className}`}
            onClick = {this.setCurrent}
            onDoubleClick = {this.changeCell}
            >   <input 
                    className='table-cell input'
                    style = {{display: showInput ? "inline-block" : "none"}}
                    autoFocus = {true}
                    defaultValue={this.props.cellFromState.formula}
                    ref={c => this.currentCell = c}
                    onChange={this.sendFormula}
                    onBlur={this.changeCell}
                /> 
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
        }
        // onSend(id, formula){
        //   console.log("onSend isn't set", id, formula)
        // }
      }
    }
  }
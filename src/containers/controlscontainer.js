import React, { Component } from 'react';
// import InputComponent from "./controls";

import { connect } from 'react-redux';

import {actionInputCell} from "../acs";

class ControlsContainer extends Component {
    // constructor(props){
    //     super(props)
    //     this.state = {
    //         controls:{
    //             funcSelect: {
    //                 inputType: 'select',
    //                 config: {
    //                     option: [
    //                         {value: 'f',
    //                             name: 'f'}, 
    //                         {value: 'sum',
    //                             name: 'sum'}, 
    //                         {value: 'diff',
    //                             name: 'diff'}, 
    //                         {value: 'prod',
    //                             name: 'prod'}, 
    //                         {value: 'quot',
    //                             name: 'quot'}
    //                     ] 
    //                 }
    //             },
    //             input: {
    //                 value: "",
    //                 config: {
    //                     type: "text",
    //                     name: "formula"
    //                 }
    //             }
    //         },
    //         allCells: [],
    //         currentCell: {
    //             id: "",
    //             formula: ""
    //         }
    //     }
    // }
    sendFormula = () => this.props.onSend(this.props.cell.id, this.inputCell.value, this.props.cell.cell )

    updateState = () => {
        console.log("blur", this.inputCell.value, this.props.cell.formula)
        if (this.inputCell.value !== this.props.cell.cell.formula){
            console.log("update")
            this.props.update( this.props.cell.cell, this.inputCell.value)
        }
    };


    render(){
        console.log("render input", this.props.cell.formula)
        return (
        <div className='controls'>
            <span name='id' className='controls_current-id' > 
                {this.props.cell.id} 
            </span>
            <span className='controls_formula-select' > 
                f
            </span>
            <input 
                className='controls_input'
                name='formula'
                type='text'
                defaultValue={this.props.cell.formula}
                ref={c => this.inputCell = c}
                onChange={this.sendFormula} 
                onBlur={this.updateState}
            />
        </div>
        )
    }
    //     const { controls } = this.state

    //     return(
    //         <div>
    //             {Object.keys(controls).map(el => (
    //                 <InputComponent
    //                 key={el}
    //                 inputType={controls[el].inputType} 
    //                 config={{ ...controls[el].config, value: controls[el].value }}
    //                 />
    //             ))}
    //         </div>
    //     )
    // }


    static get defaultProps(){
        return {
          cell: {
            id: '',
            formula: '',
          },
          onSend(id, formula){
            console.log("onSend isn't set", id, formula)
          }
        }
    }
}


export default connect(state => ({cell: state.currentCellReducer}), {onSend: actionInputCell})(ControlsContainer)
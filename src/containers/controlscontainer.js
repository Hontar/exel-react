import React, { Component } from 'react';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as actions from "../actions/acs";


class ControlsContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            enableAutoFocus: false
        }
        
    this.inputCell = React.createRef()
}
   
    changeCellFormulaKeyboard = (e) => {
        const { update, actionInputCell, enableEditing, cell } = this.props
        let enableRange = this.inputCell.current.value.toUpperCase().search(/(=\s*SUM|=\s*DIFF|=\s*PROD|=\s*DIV)\s*\(\s*/g) >= 0
        if (enableRange){
            enableEditing ( cell.id, true) // enable selection of range
        }
        if (e.key === 'Enter' ){
            if (this.inputCell.current.value !== cell.cell.formula){
                update( cell.cell, this.inputCell.current.value) // mathTable method to calculate and update value. cell - object from redux from current cell               
            }
            enableEditing( cell.id, false)
            this.setState({enableAutoFocus: false})
            this.inputCell.current.blur()
          } else {
            actionInputCell(cell.id, this.inputCell.current.value, cell.cell )
            this.setState({enableAutoFocus: true})
            this.inputCell.current.focus()
        }
    }

    updateState = (e) => {
        e.preventDefault()
        const {update, cell} = this.props
        if (this.state.enableAutoFocus){
            if(this.inputCell.current.value !== cell.cell.formula){
                update( this.props.cell.cell, this.inputCell.current.value)
                this.inputCell.current.blur()
                this.setState({enableAutoFocus: false})
            } else {
                this.inputCell.current.focus()
                this.setState({enableAutoFocus: false})
            }
        }
    };

    shouldComponentUpdate(nextProps, nextState, nextContext){        
        if(nextProps.cell.id !== this.props.cell.id){
            return true;
        }            
        return true
    }

    componentDidUpdate(prevProps, prevState) {              
        let {start, end} = this.props.selectionRange 
        if (this.props.enableArray){ // to display selection of group of cells in real time
            let enableRange = this.inputCell.current.value.toUpperCase().search(/(=\s*SUM|=\s*DIFF|=\s*PROD|=\s*DIV)\s*\(\s*/g) >= 0         
            let prevValue = this.inputCell.current.value.toUpperCase().match(/(=\s*SUM|=\s*DIFF|=\s*PROD|=\s*DIV)/g) || "="          
            if (this.inputCell.current && enableRange && start.x){ 
                if (start.x === end.x && start.y === end.y) {
                    this.inputCell.current.value = `${prevValue} (${start.y + start.x} )`
                } else this.inputCell.current.value = `${prevValue} (${start.y + start.x} : ${end.y + end.x})`            
            }
        }      
    }

    render(){
        return (
        <div className='controls' key={this.props.cell.formula} >
            <span name='id' className='controls_current-id' > 
                {this.props.cell.id ? this.props.cell.id : "ID" } 
            </span>
            <input 
                className='controls_input'
                name='formula'
                type='text'
                autoFocus={this.state.enableAutoFocus}
                disabled={this.props.cell.id ? false : true}
                defaultValue={this.props.cell.formula}
                ref={this.inputCell}
                onKeyUp={this.changeCellFormulaKeyboard}
                onBlur={this.updateState}
            />
        </div>
        )
    }   

    static get defaultProps(){
        return {
          cell: {
            id: '',
            formula: '',
            cell: {}
          },
          actionInputCell(id, formula){
            console.log("actionInputCell isn't set", id, formula)
          }
        }
    }
}

const mapStateToProps = state => {
	return {
        cell: state.cell		
	};
};

const mapDispatchToProps = dispatch => bindActionCreators({ ...actions }, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ControlsContainer);
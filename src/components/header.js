import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as actions from "../actions/table";

import { Icon } from 'antd';


class Header extends Component{
    constructor(props) {
        super(props);   
        this.state = {      
            ...this.defaultState
        } 
        this.defaultState = {      
            showInput: false,
            touch: false,
            headerTitle: "",
            toClearTable: false
        } 
        this.inputRef = React.createRef();
      }

    changeTitle = (e) => {
        console.log("title change",this.inputRef.current.value)
        this.setState(prevstate => 
            ({ ...prevstate, headerTitle: this.inputRef.current.value})
        )               
    }

    changeCellView = () => {  
        this.setState(prevstate => 
          ({ ...prevstate, showInput: !prevstate.showInput})
        )      
    }

    saveTitle = () => {
        console.dir("save title")
        const { updateItem, id } = this.props;
        if (id){
            updateItem({title: this.state.headerTitle}, id)
        }            
        this.changeCellView()
    }

    createNewTable = () => {
        const {clearSheet} = this.props
        console.log("+ click")
        // this.setState( prevstate =>({
        //     ...prevstate, toClearTable: !prevstate.toClearTable
        // }))
        clearSheet()        
    }
    
    render(){
        const {title} = this.props
        let {showInput, headerTitle} = this.state

        console.log("render header", title)
        // if (this.state.toClearTable){
        //     return <Redirect to="/" />
        // }

        return(
            <header className="header">
                <div className="header__logo-box" title="Create new file">
                    <Link  to="/" onClick={this.createNewTable} >
                        <Icon type="file-excel" className="header__logo" />
                    </Link>
                </div>
                
                    <div className="header__name-box" 
                        onDoubleClick = {this.changeCellView}
                    >
                        {showInput && 
                        <input 
                                className='header input'
                                style = {{display: showInput ? "inline-block" : "none"}}
                                autoFocus = {true}
                                ref={this.inputRef}
                                onChange={this.changeTitle}
                                onBlur={this.saveTitle}
                                defaultValue={title}                                
                            /> 
                            } 
                            <span className="header__name"
                                style = {{display: !showInput ? "inline-block" : "none"}}>
                                    {title ? title : (headerTitle ? headerTitle : "Untitled")}
                            </span>
                            <span className="header__save">
                                Save
                            </span>
                    </div> 
            </header>
        )
    }
}

const mapStateToProps = state => {
	return {
        id: state.table.id,		
		title: state.table.title		
	};
};
const mapDispatchToProps = dispatch => bindActionCreators({ ...actions }, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Header);
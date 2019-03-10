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
            showInput: false,
            headerTitle: "",
            showDelete: false
        } 
        
        this.inputRef = React.createRef();
      }

    changeTitle = (e) => {
        console.log("title change",this.inputRef.current.value)
        this.setState(prevState => 
            ({ ...prevState, headerTitle: this.inputRef.current.value})
        )               
    }

    changeCellView = () => {  
        this.setState(prevState => 
          ({ ...prevState, showInput: !prevState.showInput})
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
        clearSheet()        
    }

    deleteTable = () => {
        const {id, deleteItem} = this.props
        console.log("DELETE", id)
        // deleteItem(id)
    }

    componentDidUpdate = (prevProps, prevState) => {        
        if (this.props.id && !prevProps.id ) {
            console.log("HEADER didUpdate", this.props.id, prevState.showDelete)
            this.setState ( prevState => ({
                ...prevState, showDelete: !prevState.showDelete
            }))
        }
    }
    
    render(){
        const {title} = this.props
        let {showInput, headerTitle, showDelete} = this.state

        console.log("render header", title, showDelete)
      
        return(
            <header className="header">
                <div className="header__logo-box" title="Create new file">
                    <Link  to="/" onClick={this.createNewTable} >
                        <Icon type="file-excel" className="header__logo" />
                    </Link>
                </div>                
                <div className="header__name-box" 
                    onDoubleClick = {this.changeCellView}>
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
                <div className="header__delete-box" title="Delete file" >
                    {showDelete &&
                        <Icon type="delete" onClick={this.deleteTable} />}
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
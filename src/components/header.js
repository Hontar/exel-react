import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withRouter } from 'react-router-dom'

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
        const { updateItem, id } = this.props;
        if (id){
            updateItem({title: this.state.headerTitle}, id)
        }            
        this.changeCellView()
    }

    changeTitleKeyboard = (e) => {
        if (e.key === 'Enter' ){
            this.saveTitle()
        } else this.changeTitle()
    }

    createNewTable = () => {
        const {history, clearSheet} = this.props
        history.push("/")
        clearSheet()        
    }

    deleteTable = () => {
        const {id, deleteItem, history, clearSheet} = this.props
        deleteItem(id)        
        history.push("/")
        clearSheet()
    }

    componentDidUpdate = (prevProps, prevState) => {        
        if (this.props.id && !prevProps.id ) {
            this.setState ( prevState => ({
                ...prevState, showDelete: !prevState.showDelete
            }))
        }
    }
    
    render(){
        const {title} = this.props
        let {showInput, headerTitle, showDelete} = this.state
      
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
                                onKeyUp={this.changeTitleKeyboard}
                                // onChange={this.changeTitle}
                                onBlur={this.saveTitle}
                                defaultValue={title}                                
                            /> 
                        } 
                        <span className="header__name"
                            style = {{display: !showInput ? "inline-block" : "none"}}>
                                {title ? title : (headerTitle ? headerTitle : "Untitled")}
                        </span>                       
                </div>
                <div className="header__delete-box" title="Delete file" >
                    {showDelete &&                                            
                        <Icon type="delete" onClick={this.deleteTable} className="header__icon" />                   
                    }
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
)(withRouter(Header));
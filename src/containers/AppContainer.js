import React, { Component } from 'react';


// import update from 'immutability-helper';


// import thunk from 'redux-thunk';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as actions from "../actions/table";

import { withRouter } from 'react-router-dom'

import MathTable from './Mathtable'
import Header from '../components/Header'




class AppContainer extends Component {

    // state = {
    //     canUpdate: false
    // }

    // enableUpdate = () => {
    //     this.setState({canUpdate: true})
    // }

    componentDidMount = () => {
        const { match } = this.props;
        console.log("DidMount",this.props)
        const {getSheet, clearSheet } = this.props;
        if (match.params.id){
            getSheet(match.params.id)
            // this.enableUpdate()
        }             
    }  
    

    componentDidUpdate = (prevProps, prevState) => {
        console.log("did update", this.props)
        const { match, id } = this.props;
        const {saveItem } = this.props;
        if (id && match.params.id !== id){
            console.log("id not match")
            return this.props.history.push(`/${id}`)                
        } 
        // if (prevProps !== this.props){
            // if (match.params.id !== item){
            //     console.log("id not match")
            //     return this.props.history.push(`/`)                
            // } 
        // } else if (prevProps === this.props && match.params.id !== item) {
        //     return this.props.history.push(`/`)
        // }
        
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.item === this.props.item){
            return false
        }
        return true
    }

    render(){
        const { match } = this.props;
        console.log(match.params.id)
        
        return (
            <div className="App"> 
                <Header  enableUpdate={this.enableUpdate} />     
                <MathTable  />
            </div>
        )
    }     
}
  
const mapStateToProps = state => {
	return {
        id: state.table.id,		
	};
};

const mapDispatchToProps = dispatch => bindActionCreators({ ...actions }, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(AppContainer));


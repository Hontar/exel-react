import React, { Component } from 'react';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as actions from "../actions/table";

import { withRouter } from 'react-router-dom'

import MathTable from './Mathtable'
import Header from '../components/Header'


class AppContainer extends Component {
   
    componentDidMount = () => {
        const { match } = this.props;
        const {getSheet} = this.props;
        if (match.params.id){
            getSheet(match.params.id)
        }             
    }  
    
    componentDidUpdate = (prevProps, prevState) => {
        const { match, id, error, history, clearFailRequest } = this.props;
        if (!prevProps.error && error){
            history.push("/")
            clearFailRequest()
        }
        
        if (id && match.params.id !== id){
            return history.push(`/${id}`)                
        } 
    }

    render(){        
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
        error: state.table.error,		
	};
};

const mapDispatchToProps = dispatch => bindActionCreators({ ...actions }, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(AppContainer));


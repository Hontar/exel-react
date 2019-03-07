import React, { Component } from 'react';


// import update from 'immutability-helper';


// import thunk from 'redux-thunk';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as actions from "../actions/table";



import MathTable from './Mathtable'
import Header from '../components/Header'




class AppContainer extends Component {

    state = {
        canUpdate: false
    }

    enableUpdate = () => {
        this.setState({canUpdate: true})
    }

    componentDidMount = () => {
        const { match } = this.props;
        console.log("DidMount",this.props)
        const {getSheet, clearSheet } = this.props;
        if (match.params.id){
            getSheet(match.params.id);
            this.enableUpdate()
        } else {
            // clearSheet() 
            
        }  
    }

    componentDidUpdate = () => {
        console.log("did update", this.props)
        const {saveItem } = this.props;
        // if (!match.params.id)
            // saveItem();
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
  

const mapDispatchToProps = dispatch => bindActionCreators({ ...actions }, dispatch);

export default connect(
	null,
	mapDispatchToProps
)(AppContainer);


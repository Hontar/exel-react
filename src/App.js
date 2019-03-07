import React, { Component } from 'react';
import './style/index.scss';

// import update from 'immutability-helper';


// import thunk from 'redux-thunk';

import { Switch, Route, withRouter, Redirect } from "react-router-dom";




import MathTable from './containers/mathtable'
import Header from './components/header'




class App extends Component {



    render(){
        const { match } = this.props;

        if (!match.params.id) {
            return <Redirect to="/" />;
        }
        return (
            <div className="App"> 
                <Header />     
                <MathTable />
            </div>
        )
    }
    
    
}
  

export default App;

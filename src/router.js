import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import AppContainer from './containers/AppContainer'

class Router extends Component {

	render() {
		return (
			<div id="container">
				<Switch>
					<Route exact path="/:id" component={AppContainer} />				
					<Route exact path="/" component={AppContainer} />
					<Route render={() => <div>404 NOT FOUND</div>} />
				</Switch>
			</div>
		);
	}
}

export default Router

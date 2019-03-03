import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Header from "./components/header"
import PrivateRoute from "./privateRouter"
import MathTable from './containers/mathtable'

class Router extends Component {
	componentDidMount() {
		const token = localStorage.getItem("recentFile");

		// if (token) {
		// 	const { setToken } = this.props;
		// 	return setToken(token);
		// }
	}

	render() {
		return (
			<div className="container">
				<Header />
				<Switch>
					<PrivateRoute exact path="/:id" component={MathTable} />					
					<Route exact path="/" component={MathTable} />

					<Route render={() => <div>404 NOT FOUND</div>} />
				</Switch>
			</div>
		);
	}
}

// const mapDispatchToProps = dispatch => bindActionCreators({ setToken }, dispatch);
export default Router
// export default withRouter(
// 	connect(
// 		null,
// 		mapDispatchToProps
// 	)(Router)
// );
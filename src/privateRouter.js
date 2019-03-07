import React from "react";
import { Link, Redirect } from "react-router-dom";
import * as actions from "./actions/table";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";


const PrivateRoute = ({ component: Component, recentFile, ...rest }) => (
	<Route
		{...rest}
		render={props => {
			const recentFile = localStorage.getItem("recentFile");
			if (recentFile === null) {
				return <Redirect to="/" />;
			}

			return <Component {...props} />;
		}}
	/>
);

export default PrivateRoute;
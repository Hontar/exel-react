import React from "react";
import { Route, Redirect } from "react-router-dom";

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
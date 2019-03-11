import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import Router from "./router";

import "./style/index.scss";

import store from "./store/store.js";

// store.subscribe(() => console.log(store.getState()))

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<Router />
		</BrowserRouter>
	</Provider>,
	document.getElementById("root")
);

serviceWorker.unregister();
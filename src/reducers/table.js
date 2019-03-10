import * as types from "../constants/actionTypes";

import initialState from "../store/initialState";

export default (state = initialState.table, { type, payload }) => {
	switch (type) {
		case types.GET_SHEET: {
			return { ...state, isFetching: true };
		}
		case types.GET_SHEET_SUCCESS: {
			const { id, item, title, table } = payload;			
			return { ...state, id, item, title, table, isFetching: false, error: false };
		}
		case types.GET_SHEET_FAIL: {
			return { ...state, isFetching: false, error: true };
		}
		
		case types.SAVE_SHEET: {
			return { ...state, isFetching: true };
		}
		case types.SAVE_SHEET_SUCCESS: {
			const { id, item, title, table } = payload;
			return { ...state, id, item, title, table, isFetching: false, error: false };
		}
		case types.SAVE_SHEET_FAIL: {
			return { ...state, isFetching: false, error: true };
		}

		case types.CLEAR_SHEET: {
			return { ...initialState.table, isFetching: false };
		}

		case types.DELETE_SHEET: {
			return { ...state, isFetching: true };
		}
		case types.DELETE_SHEET_SUCCESS: {
			const { id, item, title, table } = payload;
			return { ...state, id, item, title, table, isFetching: false, error: false };
		}
		case types.DELETE_SHEET_FAIL: {
			return { ...state, isFetching: false, error: true };
		}

		case types.CLEAR_FAIL: {
			return { ...state, isFetching: false, error: false };
		}

		default:
			return state;
	}
};
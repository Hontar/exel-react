import * as types from "../constants/actionTypes";
import axios from "axios";

const getSheetRequest = (payload) => ({
    type: types.GET_SHEET,
    payload
})

const getSheetRequestSuccess = (payload) => ({
    type: types.GET_SHEET_SUCCESS,
    payload
});

const getSheetRequestRequestFail = (payload) => ({
    type: types.GET_SHEET_FAIL,
    payload
});

export function getSheet ( id ) {
    return async function (dispatch){
        dispatch (getSheetRequest())
        try {
            
            let {data} = await axios(`http://localhost:3000/states?id=${id}`
            )                
            console.log("toDoList", data[0])
            // localStorage.setItem("toDoList", data)
            dispatch (getSheetRequestSuccess(data[0]))
        }
        catch(e){
            dispatch (getSheetRequestRequestFail(e))
        }
    }
}

const postSheetRequest = (payload) => ({
    type: types.SAVE_SHEET,
    payload
})

const postSheetRequestSuccess = (payload) => ({
    type: types.SAVE_SHEET_SUCCESS,
    payload
});

const postSheetRequestFail = (payload) => ({
    type: types.SAVE_SHEET_FAIL,
    payload
});

export function saveItem (payload) {
    return async function (dispatch){
        dispatch (postSheetRequest())
        try {
            let {data} = await axios("http://localhost:3000/states",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                },
                data: payload
            })        
            dispatch (postSheetRequestSuccess(data))
        }
        catch(e){
            dispatch (postSheetRequestFail(e))
        }
    }
}


const putSheetRequest = (payload) => ({
    type: types.SAVE_SHEET,
    payload
})

const putSheetRequestSuccess = (payload) => ({
    type: types.SAVE_SHEET_SUCCESS,
    payload
});

const putSheetRequestFail = (payload) => ({
    type: types.SAVE_SHEET_FAIL,
    payload
});

export function updateItem (payload, id) {
    return async function (dispatch){
        dispatch (putSheetRequest())
        try {     
            console.log("payload", payload, id)
            let {data} = await axios(`http://localhost:3000/states/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    },
                    data: payload
                })
                console.log("update", data)
            dispatch (putSheetRequestSuccess(data))
        }
        catch(e){
            dispatch (putSheetRequestFail(e))
        }
    }
}

export const clearSheet = () => ({
    type: types.CLEAR_SHEET
});

const deleteSheetRequest = (payload) => ({
    type: types.SAVE_SHEET,
    payload
})

const deleteSheetRequestSuccess = (payload) => ({
    type: types.SAVE_SHEET_SUCCESS,
    payload
});

const deleteSheetRequestFail = (payload) => ({
    type: types.SAVE_SHEET_FAIL,
    payload
});

export const clearFailRequest = (payload) => ({
    type: types.CLEAR_FAIL,
    payload
});

export function deleteItem (id) {
    return async function (dispatch){
        dispatch (deleteSheetRequest())
        try {            
             dispatch (deleteSheetRequestSuccess(
                await axios(`http://localhost:3000/states/${id}`,
                {
                    method: "DELETE"
                }))
            )
        }
        catch(e){
            dispatch (deleteSheetRequestFail(e))
        }
    }
}
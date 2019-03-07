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

const postSheetRequest = (payload) => ({
    type: types.SAVE_SHEET,
    payload
})

const postSheetRequestSuccess = (payload) => ({
    type: types.SAVE_SHEET_SUCCESS,
    payload
});

const postSheetRequestRequestFail = (payload) => ({
    type: types.SAVE_SHEET_FAIL,
    payload
});

const putSheetRequest = (payload) => ({
    type: types.SAVE_SHEET,
    payload
})

const putSheetRequestSuccess = (payload) => ({
    type: types.SAVE_SHEET_SUCCESS,
    payload
});

const putSheetRequestRequestFail = (payload) => ({
    type: types.SAVE_SHEET_FAIL,
    payload
});

export const clearsheet = () => ({
    type: types.CLEAR_SHEET
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

export function saveItem (payload) {
    return async function (dispatch){
        dispatch (postSheetRequest())
        try {     
            // console.log("toDoList", data)
            
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
            dispatch (postSheetRequestRequestFail(e))
        }
    }
}

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
            dispatch (putSheetRequestRequestFail(e))
        }
    }
}

// export function deleteItem ({id = 1}) {
//     return async function (dispatch){
//         dispatch (todoListRequest())
//         try {            
//              dispatch (putSheetRequestSuccess(
//     await axios(`http://localhost:3000/states/${id}`,
//     {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json; charset=UTF-8"
//         },
//         data: payload
//     }))
// )
//         }
//         catch(e){
//             dispatch (todoListRequestFail(e))
//         }
//     }
// }
import {AppReducerActionsType, setAppErrorAC, setAppStatusAC} from "../app/AppReducer";
import {BaseResponseType} from "../api/todolist-api";
import {Dispatch} from "redux";

export const handlerServerError = <T>(data: BaseResponseType<T>, dispatch: errorUtilsDispatchActionTypes) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some Error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (message: string, dispatch: errorUtilsDispatchActionTypes) => {
    dispatch(setAppErrorAC(message))
    dispatch(setAppStatusAC('failed'))
}

type errorUtilsDispatchActionTypes = Dispatch<AppReducerActionsType>
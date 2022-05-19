import {AppReducerActionsType, setAppErrorAC, setAppStatusAC} from "../store/reducers/AppReducer";
import {Dispatch} from "redux";
import {BaseResponseType} from '../types';

export const handlerServerError = <T>(data: BaseResponseType<T>, dispatch: errorUtilsDispatchActionTypes) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error :'Some Error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (message: string, dispatch: errorUtilsDispatchActionTypes) => {
    dispatch(setAppErrorAC({error: message}))
    dispatch(setAppStatusAC({status: 'failed'}))
}

type errorUtilsDispatchActionTypes = Dispatch<AppReducerActionsType>
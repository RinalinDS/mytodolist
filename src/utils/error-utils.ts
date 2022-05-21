import {AppReducerActionsType, setAppErrorAC, setAppStatusAC} from "../store/reducers/AppReducer";
import {Dispatch} from "redux";
import {BaseResponseType} from '../types';

export const handlerServerError = <T>(data: BaseResponseType<T>, dispatch: errorUtilsDispatchActionTypes, showError: boolean = true) => {
  if (showError) {
    dispatch(setAppErrorAC({error: data.messages.length ? data.messages[0] : 'Some Error occurred'}))
  }
  dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (message: string, dispatch: errorUtilsDispatchActionTypes, showError: boolean = true) => {
  if (showError) {
    dispatch(setAppErrorAC({error: message ? message : 'Some Error occurred'}))
  }
  dispatch(setAppStatusAC({status: 'failed'}))
}

type errorUtilsDispatchActionTypes = Dispatch<AppReducerActionsType>
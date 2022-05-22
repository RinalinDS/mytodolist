import {AppReducerActionsType, setAppErrorAC, setAppStatusAC} from "../store/reducers/AppReducer";
import {Dispatch} from "redux";
import {BaseResponseType} from '../types';

export const handlerServerError = <T>(data: BaseResponseType<T>, dispatch: errorUtilsDispatchActionTypes, showError: boolean = true) => {
  if (showError) {
    dispatch(setAppErrorAC({error: data.messages.length ? data.messages[0] : 'Some Error occurred'}))
  }
  dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleAsyncServerError = <T>(data: BaseResponseType<T>, thunkAPI: any, showError: boolean = true) => {
  if (showError) {
    thunkAPI.dispatch(setAppErrorAC({error: data.messages.length ? data.messages[0] : 'Some Error occurred'}))
  }
  thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))
  return thunkAPI.rejectWithValue({errors: data.messages, fieldsError: data.fieldsErrors})
}


export const handleServerNetworkError = (message: string, thunkAPI : any , showError: boolean = true) => {
  if (showError) {
    thunkAPI.dispatch(setAppErrorAC({error: message ? message : 'Some Error occurred'}))
  }
  thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))
  return thunkAPI.rejectWithValue({errors: [message], fieldsError: undefined})
}

type errorUtilsDispatchActionTypes = Dispatch<AppReducerActionsType>
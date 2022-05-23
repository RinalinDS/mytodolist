import {appActions} from "../store/reducers/Application/";
import {Dispatch} from "redux";
import {BaseResponseType} from '../types';

type ThunkApiType = {
  dispatch: (action: any) => any
  rejectWithValue: Function
}

export const handlerServerError = <T>(data: BaseResponseType<T>, dispatch: Dispatch,  showError: boolean = true) => {
  if (showError) {
    dispatch(appActions.setAppError({error: data.messages.length ? data.messages[0] : 'Some Error occurred'}))
  }
  dispatch(appActions.setAppStatus({status: 'failed'}))
}

export const handleAsyncServerError = <T>(data: BaseResponseType<T>, thunkAPI: ThunkApiType, showError: boolean = true) => {
  if (showError) {
    thunkAPI.dispatch(appActions.setAppError({error: data.messages.length ? data.messages[0] : 'Some Error occurred'}))
  }
  thunkAPI.dispatch(appActions.setAppStatus({status: 'failed'}))
  return thunkAPI.rejectWithValue({errors: data.messages, fieldsError: data.fieldsErrors})
}


export const handleServerNetworkError = (message: string, thunkAPI : ThunkApiType , showError: boolean = true) => {
  if (showError) {
    thunkAPI.dispatch(appActions.setAppError({error: message ? message : 'Some Error occurred'}))
  }
  thunkAPI.dispatch(appActions.setAppStatus({status: 'failed'}))
  return thunkAPI.rejectWithValue({errors: [message], fieldsError: undefined})
}


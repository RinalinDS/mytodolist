import {BaseResponseType} from '../types';
import {setAppError, setAppStatus} from '../store/reducers/AppReducer';
import {UtilTypes} from '../types/';





export const handleAsyncServerError = <T>(data: BaseResponseType<T>, thunkAPI: UtilTypes.ThunkApiType, showError: boolean = true) => {
  if (showError) {
    thunkAPI.dispatch(setAppError({error: data.messages.length ? data.messages[0] : 'Some Error occurred'}))
  }
  thunkAPI.dispatch(setAppStatus({status: 'failed'}))
  return thunkAPI.rejectWithValue({errors: data.messages, fieldsError: data.fieldsErrors})
}


export const handleAsyncServerNetworkError = (message: string, thunkAPI: UtilTypes.ThunkApiType, showError: boolean = true) => {
  if (showError) {
    thunkAPI.dispatch(setAppError({error: message ? message : 'Some Error occurred'}))
  }
  thunkAPI.dispatch(setAppStatus({status: 'failed'}))
  return thunkAPI.rejectWithValue({errors: [message], fieldsError: undefined})
}


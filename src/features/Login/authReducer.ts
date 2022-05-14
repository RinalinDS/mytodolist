import {authAPI, FieldsErrorsType, LoginParamsType} from '../../api/todolist-api';
import {setAppStatusAC} from '../../app/AppReducer';
import {handlerServerError, handleServerNetworkError} from '../../utils/error-utils';
import {AxiosError} from 'axios';
import {ThunkType} from '../../app/store';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {clearTodolistsDataAC} from '../TodolistList/TodolistsReducer';

export const loginTC = createAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType, { rejectValue: { errors: Array<string>, fieldsError?: FieldsErrorsType[] } }>('auth/login', async (data: LoginParamsType, {
  dispatch,
  ...thunkAPI
}) => {
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.login(data)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      return {isLoggedIn: true}
    } else {
      handlerServerError(res.data, dispatch)
      return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsError: res.data.fieldsErrors}) // выплюнуть action с типом rejected, v reduxe я его не обрабатываю, хотя можно, но использую его в формике. Еррорс попадает в пейлоад actiona-a
    }
  } catch (error: any) {
    let e: AxiosError = error;
    handleServerNetworkError(e.message, dispatch)
    return thunkAPI.rejectWithValue({errors: [e.message], fieldsError: undefined})
  }
})


const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    } // не удаляю, потому что его использую еще в других местах, поэтому возможно тут был излишний рефактор через createAsyncThunk, но что уж поделаешь.
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
  }

})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions


// thunks


export const logoutTC = (): ThunkType => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  authAPI.logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC({value: false}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
        dispatch(clearTodolistsDataAC({}))
      } else {
        handlerServerError(res.data, dispatch)
      }
    }).catch((error: AxiosError) => {
    handleServerNetworkError(error.message, dispatch)
  })
}



import {authAPI, FieldsErrorsType, LoginParamsType} from '../../api/todolist-api';
import {setAppStatusAC} from '../../app/AppReducer';
import {handlerServerError, handleServerNetworkError} from '../../utils/error-utils';
import {AxiosError} from 'axios';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {clearTodolistsDataAC} from '../TodolistList/TodolistsReducer';


// вот эта огромная типизация снизу : 1е это типизация fullfilled payloda , 2е, типизация передаваемых аргументов в санку, 3е типизация reject payloda.
// чтобы в формике не говорило, что action.payload при reject - type unknown, а нормально все было,
// только андефайнд в филдсерроре надо проверить (action.payload?.fieldsErrors), т.к. его задавал Я.
// UPD : так как мне теперь не нужен первый тип вместо, то {isLoggedIn: boolean} стал undefined, т.к. у меня пустой ретурн.
export const loginTC = createAsyncThunk<undefined, LoginParamsType, { rejectValue: { errors: Array<string>, fieldsError?: FieldsErrorsType[] } }>('auth/login', async (data: LoginParamsType, {
  dispatch,
  ...thunkAPI
}) => {
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.login(data)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      return; // получается , что если я нажму ретурн, значит позитивный ауткам, а значит можно не передавать лишний раз "тру", а в редюсере менять без пейлоада на "тру"
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
// НИКОГДА БЛЯДЬ НЕ ПИШИ ПУСТОЙ ОБЪЕКТ ( {} ) ЕСЛИ НЕT ПАРАМЕТРОВ ! ВСТАВЬ РАНДОМНОЕ НАЗВАНИЕ , НО НЕ ПУСТОЙ ОБЪЕКТ !
export const logoutTC = createAsyncThunk('auth/logout', async (_, {dispatch, ...thunkAPI}) => {
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.logout()
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      dispatch(clearTodolistsDataAC({}))
      return
    } else {
      handlerServerError(res.data, dispatch)
      return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsError: res.data.fieldsErrors})
    }
  } catch (e: any) {
    const error: AxiosError = e
    handleServerNetworkError(error.message, dispatch)
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
      .addCase(loginTC.fulfilled, (state) => {
        state.isLoggedIn = true
      })
      .addCase(logoutTC.fulfilled, (state) => {
        state.isLoggedIn = false
      })
  }

})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions


// thunks





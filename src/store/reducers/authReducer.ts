import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {LoginParamsType, RejectValueType} from '../../types';
import {appActions} from './Application/';
import {authAPI} from '../../api/API';
import {handleAsyncServerError, handleServerNetworkError} from '../../utils/error-utils';
import {clearTodolistsData} from './TodolistsReducer';
import {StatusCode} from '../../enums';

// вот эта огромная типизация снизу : 1е это типизация fullfilled payloda , 2е, типизация передаваемых аргументов в санку, 3е типизация reject payloda.
// чтобы в формике не говорило, что action.payload при reject - type unknown, а нормально все было,
// только андефайнд в филдсерроре надо проверить (action.payload?.fieldsErrors), т.к. его задавал Я.
// UPD : так как мне теперь не нужен первый тип вместо, то {isLoggedIn: boolean} стал undefined, т.к. у меня пустой ретурн.


export const login = createAsyncThunk<undefined, LoginParamsType, RejectValueType>('auth/login', async (data: LoginParamsType, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI
  try {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    const res = await authAPI.login(data)
    if (res.data.resultCode === StatusCode.Success) {
      dispatch(appActions.setAppStatus({status: 'succeeded'}))
      return; // получается , что если я нажму ретурн, значит позитивный ауткам, а значит можно не передавать лишний раз "тру", а в редюсере менять без пейлоада на "тру"
    } else {
      handleAsyncServerError(res.data, thunkAPI)
      return rejectWithValue({errors: res.data.messages, fieldsError: res.data.fieldsErrors}) // выплюнуть action с типом rejected, v reduxe я его не обрабатываю, хотя можно, но использую его в формике. Еррорс попадает в пейлоад actiona-a
    }
  } catch (e) {
    handleServerNetworkError((e as Error).message, thunkAPI)
    return rejectWithValue({errors: [(e as Error).message], fieldsError: undefined})
  }
})
// НИКОГДА БЛЯДЬ НЕ ПИШИ ПУСТОЙ ОБЪЕКТ ( {} ) ЕСЛИ НЕT ПАРАМЕТРОВ ! ВСТАВЬ РАНДОМНОЕ НАЗВАНИЕ , НО НЕ ПУСТОЙ ОБЪЕКТ !
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI
  try {
    dispatch(appActions.setAppStatus({status: 'loading'}))
    const res = await authAPI.logout()
    if (res.data.resultCode === StatusCode.Success) {
      dispatch(appActions.setAppStatus({status: 'succeeded'}))
      dispatch(clearTodolistsData())
      return
    } else {
      handleAsyncServerError(res.data, thunkAPI)
      return rejectWithValue({errors: res.data.messages, fieldsError: res.data.fieldsErrors})
    }
  } catch (e) {
    handleServerNetworkError((e as Error).message, thunkAPI)
    return rejectWithValue({errors: [(e as Error).message], fieldsError: undefined})
  }
})

export const asyncActions = {
  login,
  logout,
}

const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    } // не удаляю, потому что его использую еще в других местах, поэтому возможно тут был излишний рефактор через createAsyncThunk, но что уж поделаешь.
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isLoggedIn = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false
      })
  }
})

export const authReducer = slice.reducer
export const {setIsLoggedIn} = slice.actions






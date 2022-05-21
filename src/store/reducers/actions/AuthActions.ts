import {createAsyncThunk} from '@reduxjs/toolkit';
import {FieldsErrorsType, LoginParamsType} from '../../../types';
import {setAppStatusAC} from '../AppReducer';
import {authAPI} from '../../../api/API';
import {handlerServerError, handleServerNetworkError} from '../../../utils/error-utils';
import {clearTodolistsData} from '../TodolistsReducer';

// вот эта огромная типизация снизу : 1е это типизация fullfilled payloda , 2е, типизация передаваемых аргументов в санку, 3е типизация reject payloda.
// чтобы в формике не говорило, что action.payload при reject - type unknown, а нормально все было,
// только андефайнд в филдсерроре надо проверить (action.payload?.fieldsErrors), т.к. его задавал Я.
// UPD : так как мне теперь не нужен первый тип вместо, то {isLoggedIn: boolean} стал undefined, т.к. у меня пустой ретурн.

export const login = createAsyncThunk<undefined, LoginParamsType, { rejectValue: { errors: Array<string>, fieldsError?: FieldsErrorsType[] } }>('auth/login', async (data: LoginParamsType, {
  dispatch,
  rejectWithValue,
}) => {
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.login(data)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      return; // получается , что если я нажму ретурн, значит позитивный ауткам, а значит можно не передавать лишний раз "тру", а в редюсере менять без пейлоада на "тру"
    } else {
      handlerServerError(res.data, dispatch)
      return rejectWithValue({errors: res.data.messages, fieldsError: res.data.fieldsErrors}) // выплюнуть action с типом rejected, v reduxe я его не обрабатываю, хотя можно, но использую его в формике. Еррорс попадает в пейлоад actiona-a
    }
  } catch (e) {
    handleServerNetworkError((e as Error).message, dispatch)
    return rejectWithValue({errors: [(e as Error).message], fieldsError: undefined})
  }
})
// НИКОГДА БЛЯДЬ НЕ ПИШИ ПУСТОЙ ОБЪЕКТ ( {} ) ЕСЛИ НЕT ПАРАМЕТРОВ ! ВСТАВЬ РАНДОМНОЕ НАЗВАНИЕ , НО НЕ ПУСТОЙ ОБЪЕКТ !
export const logout = createAsyncThunk('auth/logout', async (_, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await authAPI.logout()
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      dispatch(clearTodolistsData())
      return
    } else {
      handlerServerError(res.data, dispatch)
      return rejectWithValue({errors: res.data.messages, fieldsError: res.data.fieldsErrors})
    }
  } catch (e) {
    handleServerNetworkError((e as Error).message, dispatch)
    return rejectWithValue({errors: [(e as Error).message], fieldsError: undefined})
  }
})
import {createAsyncThunk} from '@reduxjs/toolkit';
import {authAPI} from '../../../api/API';
import {setIsLoggedInAC} from '../authReducer';


// НИКОГДА БЛЯДЬ НЕ ПИШИ ПУСТОЙ ОБЪЕКТ ( {} ) ЕСЛИ НЕТУ ПАРАМЕТРОВ ! ВСТАВЬ РАНДОМНОЕ НАЗВАНИЕ , НО НЕ ПУСТОЙ ОБЪЕКТ !

export const initializeApp = createAsyncThunk('app/initializeAppTC', async (_, {dispatch}) => {
  const res = await authAPI.me()
  if (res.data.resultCode === 0) {
    dispatch(setIsLoggedInAC({value: true}))
  }
  return {}
})
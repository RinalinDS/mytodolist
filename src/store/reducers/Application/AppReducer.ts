import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {NullableType, RequestStatusType} from '../../../types';
import {authAPI} from '../../../api/API';
import {setIsLoggedIn} from '../authReducer';
import {StatusCode} from '../../../enums';


// НИКОГДА БЛЯДЬ НЕ ПИШИ ПУСТОЙ ОБЪЕКТ ( {} ) ЕСЛИ НЕТУ ПАРАМЕТРОВ ! ВСТАВЬ РАНДОМНОЕ НАЗВАНИЕ , НО НЕ ПУСТОЙ ОБЪЕКТ !

export const initializeApp = createAsyncThunk('app/initializeAppTC', async (_, {dispatch}) => {
  const res = await authAPI.me()
  if (res.data.resultCode === StatusCode.Success) {
    dispatch(setIsLoggedIn({value: true}))
  }
  return ''
})

export const asyncActions = {
  initializeApp
}

export const slice = createSlice({
  name: 'app',
  initialState: {
    status: 'idle' as RequestStatusType,
    error: null as NullableType<string>,
    isInitialized: false
  },
  reducers: {
    setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setAppError(state, action: PayloadAction<{ error: NullableType<string> }>) {
      state.error = action.payload.error
    },
  },
  extraReducers: builder => {
    builder
      .addCase(initializeApp.fulfilled, (state) => {
        state.isInitialized = true
      })
  }

})

export const {setAppStatus, setAppError} = slice.actions








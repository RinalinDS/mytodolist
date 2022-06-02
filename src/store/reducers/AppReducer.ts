import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {NullableType, RequestStatusType} from '../../types';
import {authAPI} from '../../api/API';
import {StatusCode} from '../../enums';
import {authActions} from './AuthReducer';


// НИКОГДА БЛЯДЬ НЕ ПИШИ ПУСТОЙ ОБЪЕКТ ( {} ) ЕСЛИ НЕТУ ПАРАМЕТРОВ ! ВСТАВЬ РАНДОМНОЕ НАЗВАНИЕ , НО НЕ ПУСТОЙ ОБЪЕКТ !

export const initializeApp = createAsyncThunk('app/initializeAppTC', async (_, {dispatch}) => {
  const res = await authAPI.me()
  if (res.data.resultCode === StatusCode.Success) {
    dispatch(authActions.setIsLoggedIn({value: true}))
  }
  return ''
})


const slice = createSlice({
  name: 'app',
  initialState: {
    status: 'idle' as RequestStatusType,
    error: null as NullableType<string>,
    isInitialized: false,
    theme: 'dark'
  },
  reducers: {
    setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setAppError(state, action: PayloadAction<{ error: NullableType<string> }>) {
      state.error = action.payload.error
    },
    setAppTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(initializeApp.fulfilled, (state) => {
        state.isInitialized = true
      })
  }

})

export const appReducer = slice.reducer
export const {setAppStatus, setAppError, setAppTheme} = slice.actions

export const appActions = {
  initializeApp,
  setAppStatus,
  setAppError,
  setAppTheme
}







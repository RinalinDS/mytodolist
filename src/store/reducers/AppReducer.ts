import {authAPI} from '../../api/API';
import {setIsLoggedInAC} from './authReducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {NullableType, RequestStatusType} from '../../types';


// НИКОГДА БЛЯДЬ НЕ ПИШИ ПУСТОЙ ОБЪЕКТ ( {} ) ЕСЛИ НЕ ПАРАМЕТРОВ ! ВСТАВЬ РАНДОМНОЕ НАЗВАНИЕ , НО НЕ ПУСТОЙ ОБЪЕКТ !
export const initializeAppTC = createAsyncThunk('app/initializeAppTC', async (_, {dispatch}) => {
  const res = await authAPI.me()
  if (res.data.resultCode === 0) {
    dispatch(setIsLoggedInAC({value: true}))
  }
  return {}
})

// export const initializeAppTC_ = (): ThunkType => dispatch => {
//   authAPI.me().then(res => {
//     if (res.data.resultCode === 0) {
//       dispatch(setIsLoggedInAC({value: true}));
//     } else {
//       handlerServerError(res.data, dispatch)
//     }
//   }).catch((error: AxiosError) => {
//     handleServerNetworkError(error.message, dispatch)
//   })
//     .finally(() => {
//       dispatch(setInitializeAC({isInitialized: true}))
//     })
// }

const slice = createSlice({
  name: 'app',
  initialState: {
    status: 'idle' as RequestStatusType,
    error: null as NullableType<string>,
    isInitialized: false
  },
  reducers: {
    setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setAppErrorAC(state, action: PayloadAction<{ error: NullableType<string> }>) {
      state.error = action.payload.error
    },
  },
  extraReducers: builder => {
    builder
      .addCase(initializeAppTC.fulfilled, (state) => {
        state.isInitialized = true
      })
  }

})

export const appReducer = slice.reducer

// это реально ЭКШН КРЕАТОРЫ , автоматом сформрованные РедаксТулКитом, на основе методов(мини-редюсеров)
// да они идентичны по названию, но это разные штуки.
export const {setAppStatusAC, setAppErrorAC} = slice.actions


export type setAppStatusACType = ReturnType<typeof setAppStatusAC>
export type setAppErrorACType = ReturnType<typeof setAppErrorAC>

export type AppReducerActionsType = setAppStatusACType | setAppErrorACType







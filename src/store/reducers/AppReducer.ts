import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {NullableType, RequestStatusType} from '../../types';
import {initializeApp} from './actions/AppActions';


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
      .addCase(initializeApp.fulfilled, (state) => {
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







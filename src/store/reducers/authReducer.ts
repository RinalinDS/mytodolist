import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {authActions} from './actions/';


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
      .addCase(authActions.login.fulfilled, (state) => {
        state.isLoggedIn = true
      })
      .addCase(authActions.logout.fulfilled, (state) => {
        state.isLoggedIn = false
      })
  }
})

export const authReducer = slice.reducer
export const {setIsLoggedIn} = slice.actions






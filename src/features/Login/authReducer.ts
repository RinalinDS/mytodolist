import {authAPI, LoginParamsType} from '../../api/todolist-api';
import {setAppStatusAC} from '../../app/AppReducer';
import {handlerServerError, handleServerNetworkError} from '../../utils/error-utils';
import {AxiosError} from 'axios';
import {ThunkType} from '../../app/store';

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {clearTodolistsDataAC} from '../TodolistList/TodolistsReducer';

const initialState = {
    isLoggedIn: false
}


const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions


// thunks
export const loginTC = (data: LoginParamsType): ThunkType => dispatch => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.login(data)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handlerServerError(res.data, dispatch)
            }
        }).catch((error: AxiosError) => {
        handleServerNetworkError(error.message, dispatch)
    })
}

export const logoutTC = (): ThunkType => dispatch => {
    dispatch(setAppStatusAC({status:'loading'}))
    authAPI.logout()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatusAC({status:'succeeded'}))
                dispatch(clearTodolistsDataAC({}))
            } else {
                handlerServerError(res.data, dispatch)
            }
        }).catch((error: AxiosError) => {
        handleServerNetworkError(error.message, dispatch)
    })
}



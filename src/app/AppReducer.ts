import {ThunkType} from './store';
import {authAPI} from '../api/todolist-api';
import {setIsLoggedInAC} from '../features/Login/authReducer';
import {handlerServerError, handleServerNetworkError} from '../utils/error-utils';
import {AxiosError} from 'axios';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as NullableType<string>,
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: NullableType<string> }>) {
            state.error = action.payload.error
        },
        setInitializeAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }
    }

})

export const appReducer = slice.reducer

// это реально ЭКШН КРЕАТОРЫ , автоматом сформрованные РедаксТулКитом, на основе методов(мини-редюсеров)
// да они идентичны по названию, но это разные штуки.
export const {setAppStatusAC, setAppErrorAC, setInitializeAC} = slice.actions


// thunks

export const initializeAppTC = (): ThunkType => dispatch => {
    authAPI.me().then(res => {

        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}));
        } else {
            handlerServerError(res.data, dispatch)
        }
    }).catch((error: AxiosError) => {
        handleServerNetworkError(error.message, dispatch)
    })
        .finally(() => {
            dispatch(setInitializeAC({ isInitialized: true }))
        })
}


export type setAppStatusACType = ReturnType<typeof setAppStatusAC>
export type setAppErrorACType = ReturnType<typeof setAppErrorAC>

export type AppReducerActionsType = setAppStatusACType | setAppErrorACType | ReturnType<typeof setInitializeAC>


export type NullableType<T> = null | T

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'




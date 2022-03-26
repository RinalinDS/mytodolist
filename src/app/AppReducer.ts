import {ThunkType} from './store';
import {authAPI} from '../api/todolist-api';
import {setIsLoggedInAC} from '../features/Login/authReducer';
import {handlerServerError, handleServerNetworkError} from '../utils/error-utils';
import {AxiosError} from 'axios';

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as NullableType<string>,
    isInitialized: false
}

export const appReducer = (state: InitialStateTypeForAppReducer = initialState, action: AppReducerActionsType): InitialStateTypeForAppReducer => {

    switch (action.type) {
        case "APP/SET-STATUS":
            return {...state, ...action.payload}
        case "APP/SET-ERROR":
            return {...state, ...action.payload}
        case 'APP/SET-INITIALIZE':
            return {...state, ...action.payload}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => {
    return {
        type: 'APP/SET-STATUS',
        payload: {
            status
        }
    } as const
}
export const setAppErrorAC = (error: NullableType<string>) => {
    return {
        type: 'APP/SET-ERROR',
        payload: {
            error
        }
    } as const
}

export const setInitializeAC = (isInitialized: boolean) => {
    return {
        type: 'APP/SET-INITIALIZE',
        payload: {
            isInitialized
        }
    } as const
}

// thunks

export const initializeAppTC = (): ThunkType => dispatch => {
    authAPI.me().then(res => {

        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
        } else {
            handlerServerError(res.data, dispatch)
        }
    }).catch((error: AxiosError) => {
        handleServerNetworkError(error.message, dispatch)
    })
        .finally(() => {
            dispatch(setInitializeAC(true))
        })
}


export type setAppStatusACType = ReturnType<typeof setAppStatusAC>
export type setAppErrorACType = ReturnType<typeof setAppErrorAC>

export type AppReducerActionsType = setAppStatusACType | setAppErrorACType | ReturnType<typeof setInitializeAC>


export type NullableType<T> = null | T

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

type InitialStateTypeForAppReducer = typeof initialState


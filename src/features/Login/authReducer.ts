import {authAPI, LoginParamsType} from '../../api/todolist-api';
import {setAppErrorACType, setAppStatusAC, setAppStatusACType} from '../../app/AppReducer';
import {handlerServerError, handleServerNetworkError} from '../../utils/error-utils';
import {AxiosError} from 'axios';
import {ThunkType} from '../../app/store';

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginParamsType): ThunkType => dispatch => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handlerServerError(res.data, dispatch)
            }
        }).catch((error: AxiosError) => {
        handleServerNetworkError(error.message, dispatch)
    })
}

export const logoutTC = (): ThunkType => dispatch => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handlerServerError(res.data, dispatch)
            }
        }).catch((error: AxiosError) => {
        handleServerNetworkError(error.message, dispatch)
    })
}

// types
export type AuthActionsType = ReturnType<typeof setIsLoggedInAC> | setAppStatusACType | setAppErrorACType

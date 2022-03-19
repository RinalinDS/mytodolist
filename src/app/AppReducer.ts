const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as NullableType<string>
}

export const appReducer = (state: InitialStateTypeForAppReducer = initialState, action: AppReducerActionsType):InitialStateTypeForAppReducer => {
    switch (action.type) {
        case "APP/SET-STATUS":
            return {...state, ...action.payload}
        case "APP/SET-ERROR":
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



export type setAppStatusACType = ReturnType<typeof setAppStatusAC>
export type setAppErrorACType = ReturnType<typeof setAppErrorAC>

export type AppReducerActionsType = setAppStatusACType | setAppErrorACType


export type NullableType<T> = null | T

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

type InitialStateTypeForAppReducer = typeof initialState


import {applyMiddleware, combineReducers, createStore} from "redux";
import {TodolistsActionType, todolistsReducer} from "../features/TodolistList/TodolistsReducer";
import {TasksActionType, tasksReducer} from "../features/TodolistList/TasksReducer";
import thunkMiddleware, {ThunkAction} from "redux-thunk";
import {appReducer, AppReducerActionsType} from "./AppReducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {AuthActionsType, authReducer} from '../features/Login/authReducer';


const reducers = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})

export const store = createStore(reducers, applyMiddleware(thunkMiddleware))

// общая типизация для стейта приложения
export type AppRootStateType = ReturnType<typeof reducers>

// все типы action-ов из редьюсеров. (всего приложения)
export type AppActionTypes = TodolistsActionType | TasksActionType | AppReducerActionsType | AuthActionsType
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// по умолчанию если не указано ретурн тайп будет войд
export type ThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionTypes>

// @ts-ignore
window.store = store
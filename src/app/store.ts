import {AnyAction, combineReducers} from "redux";
import {todolistsReducer} from "../features/TodolistList/TodolistsReducer";
import {tasksReducer} from "../features/TodolistList/TasksReducer";
import thunkMiddleware, {ThunkAction} from "redux-thunk";
import {appReducer} from "./AppReducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {authReducer} from '../features/Login/authReducer';
import {configureStore} from '@reduxjs/toolkit';


const reducers = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: reducers,
    middleware: [thunkMiddleware]
})


// общая типизация для стейта приложения
export type AppRootStateType = ReturnType<typeof reducers>

// все типы action-ов из редьюсеров. (всего приложения)

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// по умолчанию если не указано ретурн тайп будет войд
export type ThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

// @ts-ignore
window.store = store
import {AnyAction, combineReducers} from "redux";
import {todolistsReducer} from "../features/TodolistList/TodolistsReducer";
import {tasksReducer} from "../features/TodolistList/TasksReducer";
import thunkMiddleware, {ThunkAction} from "redux-thunk";
import {appReducer} from "./AppReducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
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
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunkMiddleware)
})
// На суппорте друг сказал, что можно вообще не использовать миддлвейр если РТК + асинк санки , но я пока не все таки буду использовать
// middleware: [thunkMiddleware] , такая запись приводила к ошибке при типизации диспатча, который типизировался тут в сторе, и выдавало ошибку, когда диспатчили санку!


// общая типизация для стейта приложения
export type AppRootStateType = ReturnType<typeof reducers>

// все типы action-ов из редьюсеров. (всего приложения)

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// по умолчанию если не указано ретурн тайп будет войд
export type ThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

type AppDispatchType = typeof store.dispatch
// типизация диспатча, все как в документации :
// the default Dispatch type does not know about thunks or other middleware.
// In order to correctly dispatch thunks, you need to use the specific customized AppDispatch type
// from the store that includes the thunk middleware types, and use that with useDispatch.
// Adding a pre-typed useDispatch hook keeps you from forgetting to import AppDispatch where it's needed
// короче чтобы впитывал санки нормально? Санки мидлвейр обязатльеон через concat.
export const useAppDispatch = () => useDispatch<AppDispatchType>()
// useAppDispatch чтобы легче было чето-там делать контретко, чтобы action, который вернулся из редакс тулкита был типизирован, кажется так.

// @ts-ignore
window.store = store
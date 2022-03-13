import {applyMiddleware, combineReducers, createStore} from "redux";
import {todolistsReducer} from "./TodolistsReducer";
import {tasksReducer} from "./TasksReducer";
import thunkMiddleware from "redux-thunk";


const reducers = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
})

export const store = createStore(reducers, applyMiddleware(thunkMiddleware))

export type AppRootStateType = ReturnType<typeof reducers>


import {combineReducers, createStore} from "redux";
import {todolistsReducer} from "./TodolistsReducer";
import {tasksReducer} from "./TasksReducer";


const reducers = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
})

export const store = createStore(reducers)

export type AppRootStateType = ReturnType<typeof reducers>


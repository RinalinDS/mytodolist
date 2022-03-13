import {applyMiddleware, combineReducers, createStore} from "redux";
import {todolistsReducer} from "../features/TodolistsReducer";
import {tasksReducer} from "../features/TasksReducer";
import thunkMiddleware from "redux-thunk";


const reducers = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer,
})

export const store = createStore(reducers, applyMiddleware(thunkMiddleware))

export type AppRootStateType = ReturnType<typeof reducers>


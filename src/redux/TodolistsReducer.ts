import {v1} from "uuid";
import {TodolistType} from "../api/todolist-api";


const initialState: Array<TodolistDomainType> = []

export type FilterValueType = "all" | "active" | "completed"

export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: GeneralType): Array<TodolistDomainType> => {

    switch (action.type) {
        case "CHANGE-TODOLIST-TITLE":
            return state.map(m => m.id === action.payload.todolistID ? {...m, title: action.payload.title} : m)
        case "CHANGE-FILTER" :
            return state.map(m => m.id === action.payload.todolistID ? {...m, filter: action.payload.value} : m)
        case "REMOVE-TODOLIST":
            return state.filter(f => f.id !== action.payload.todolistID)
        case "ADD-TODOLIST":
            return [{id: action.payload.todolistID, title: action.payload.title, filter: "all", addedDate: '', order: 0}, ...state]
        default:
            return state


    }
}

type GeneralType = changeTodolistTitleACType | changeFilterACType | removeTodolistACType | addTodolistACType

type changeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>

export const changeTodolistTitleAC = (todolistID: string, title: string) => {
    return {
        type: "CHANGE-TODOLIST-TITLE",
        payload: {
            todolistID,
            title
        }
    } as const
}

type changeFilterACType = ReturnType<typeof changeFilterAC>

export const changeFilterAC = (value: FilterValueType, todolistID: string) => {
    return {
        type: "CHANGE-FILTER",
        payload: {
            value,
            todolistID
        }
    } as const
}

export type removeTodolistACType = ReturnType<typeof removeTodolistAC>

export const removeTodolistAC = (todolistID: string) => {
    return {
        type: "REMOVE-TODOLIST",
        payload: {
            todolistID
        }
    } as const

}

export type addTodolistACType = ReturnType<typeof addTodolistAC>

export const addTodolistAC = (title: string) => {

    return {
        type: "ADD-TODOLIST",
        payload: {
            todolistID: v1(),
            title
        }
    } as const
}
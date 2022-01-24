import {FilterValueType, TodolistType} from "./App";

export const TodolistReducer = (state: Array<TodolistType>, action: GeneralType) => {
    switch (action.type) {
        case "CHANGE-TODOLIST-TITLE":
            return state.map(m => m.id === action.payload.todolistID ? {...m, title: action.payload.title} : m)
        case "CHANGE-FILTER" :
            return state.map(m => m.id === action.payload.todolistID ? {...m, filter: action.payload.value} : m)
        case "REMOVE-TODOLIST":
            return state.filter(f => f.id !== action.payload.todolistID)
        case "ADD-TODOLIST":
            let newTodolist: TodolistType = {id: action.payload.todolistID, title: action.payload.title, filter: "all"}
            return [newTodolist, ...state]
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

type removeTodolistACType = ReturnType<typeof removeTodolistAC>

export const removeTodolistAC = (todolistID: string) => {
    return {
        type: "REMOVE-TODOLIST",
        payload: {
            todolistID
        }
    } as const

}

type addTodolistACType = ReturnType<typeof addTodolistAC>

export const addTodolistAC = (todolistID: string, title: string) => {
    return {
        type: "ADD-TODOLIST",
        payload: {
            todolistID,
            title
        }
    } as const
}
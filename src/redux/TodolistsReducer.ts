import {FilterValueType, TodolistType} from "../AppWithRedux";
import {v1} from "uuid";

export const todolistID1 = v1();
export const todolistID2 = v1();

const initialState: Array<TodolistType> = [
    {id: todolistID1, title: "What to learn", filter: "all"},
    {id: todolistID2, title: "What to watch", filter: "all"}
]

export const todolistsReducer = (state: Array<TodolistType> = initialState, action: GeneralType): Array<TodolistType> => {

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
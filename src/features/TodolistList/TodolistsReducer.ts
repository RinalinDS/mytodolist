import {todolistApi, TodolistType} from "../../api/todolist-api";
import {Dispatch} from "redux";
import {ThunkType} from "../../app/store";

//initial state

const initialState: Array<TodolistDomainType> = []

//reducer

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistsActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "CHANGE-TODOLIST-TITLE":
            return state.map(m => m.id === action.payload.todolistID ? {...m, title: action.payload.title} : m)
        case "CHANGE-FILTER" :
            return state.map(m => m.id === action.payload.todolistID ? {...m, filter: action.payload.filter} : m)
        case "REMOVE-TODOLIST":
            return state.filter(f => f.id !== action.payload.todolistID)
        case "ADD-TODOLIST":
            return [{...action.payload.todolist, filter: 'all'}, ...state]
        case "GET-TODOLISTS":
            return action.payload.todolists.map(m => ({...m, filter: "all"}))
        default:
            return state
    }
}


// actions

export const changeTodolistTitleAC = (todolistID: string, title: string) => ({
    type: "CHANGE-TODOLIST-TITLE",
    payload: {
        todolistID,
        title
    }
} as const)

export const changeFilterAC = (filter: FilterValueType, todolistID: string) => ({
    type: "CHANGE-FILTER",
    payload: {
        filter,
        todolistID
    }
} as const)

export const removeTodolistAC = (todolistID: string) => ({
    type: "REMOVE-TODOLIST",
    payload: {
        todolistID
    }
} as const)

export const addTodolistAC = (todolist: TodolistType) => ({
    type: "ADD-TODOLIST",
    payload: {
        todolist
    }
} as const)

export const getTodolitsAC = (todolists: Array<TodolistType>) => ({
    type: "GET-TODOLISTS",
    payload: {
        todolists
    }
} as const)


// thunks

export const getTodolistsTC = ():ThunkType => (dispatch: Dispatch) => {
    todolistApi.getTodos()
        .then((res) => {
            dispatch(getTodolitsAC(res.data))
        })
}

export const deleteTodolistTC = (todolistID: string):ThunkType => (dispatch: Dispatch) => {
    todolistApi.deleteTodo(todolistID)
        .then((res) => {
            dispatch(removeTodolistAC(todolistID))
        })
}

export const createTodolistTC = (title: string):ThunkType => (dispatch: Dispatch) => {
    todolistApi.createTodo(title)
        .then((res) => {
            dispatch(addTodolistAC(res.data.data.item))
        })
}

export const changeTodolistTitleTC = (todolistID: string, title: string):ThunkType => (dispatch: Dispatch) => {
    todolistApi.updateTodoTitle(title, todolistID)
        .then((res) => {
            dispatch(changeTodolistTitleAC(todolistID, title))
        })
}

// types

export type TodolistsActionType = ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeFilterAC>
    | removeTodolistACType
    | addTodolistACType
    | getTodolitsACType


export type getTodolitsACType = ReturnType<typeof getTodolitsAC>
export type addTodolistACType = ReturnType<typeof addTodolistAC>
export type removeTodolistACType = ReturnType<typeof removeTodolistAC>


export type FilterValueType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
}
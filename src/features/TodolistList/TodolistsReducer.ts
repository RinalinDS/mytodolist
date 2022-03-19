import {todolistApi, TodolistType} from "../../api/todolist-api";
import {ThunkType} from "../../app/store";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "../../app/AppReducer";

//initial state

const initialState: Array<TodolistDomainType> = []

//reducer

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistsActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "CHANGE-TODOLIST-TITLE":
            return state.map(m => m.id === action.payload.todolistID ? {...m, title: action.payload.title} : m)
        case "CHANGE-FILTER" :
            return state.map(m => m.id === action.payload.todolistID ? {...m, filter: action.payload.filter} : m)
        case "CHANGE-ENTITY-STATUS":
            return state.map(m => m.id === action.payload.todolistID ? {...m, entityStatus: action.payload.entityStatus} : m)
        case "REMOVE-TODOLIST":
            return state.filter(f => f.id !== action.payload.todolistID)
        case "ADD-TODOLIST":
            return [{...action.payload.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case "GET-TODOLISTS":
            return action.payload.todolists.map(m => ({...m, filter: "all", entityStatus: 'idle'}))
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

export const changeEntityStatusAC = (entityStatus: RequestStatusType, todolistID: string) => ({
    type: "CHANGE-ENTITY-STATUS",
    payload: {
        entityStatus,
        todolistID
    }
} as const)



// thunks

export const getTodolistsTC = (): ThunkType => dispatch => {
    dispatch(setAppStatusAC('loading'))
    todolistApi.getTodos()
        .then((res) => {
            dispatch(getTodolitsAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
        })
}

export const deleteTodolistTC = (todolistID: string): ThunkType => dispatch => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeEntityStatusAC('loading', todolistID))
    todolistApi.deleteTodo(todolistID)
        .then((res) => {
            dispatch(removeTodolistAC(todolistID))
            dispatch(setAppStatusAC('succeeded'))
        })
}

export const createTodolistTC = (title: string): ThunkType => dispatch => {
    dispatch(setAppStatusAC('loading'))
    todolistApi.createTodo(title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                if (res.data.messages.length) {
                    dispatch(setAppErrorAC(res.data.messages[0]))
                } else {
                    dispatch(setAppErrorAC('Some Error occured'))
                }
                dispatch(setAppStatusAC('failed'))
            }
        })
}

export const changeTodolistTitleTC = (todolistID: string, title: string): ThunkType => dispatch => {
    dispatch(setAppStatusAC('loading'))
    todolistApi.updateTodoTitle(title, todolistID)
        .then((res) => {
            dispatch(changeTodolistTitleAC(todolistID, title))
            dispatch(setAppStatusAC('succeeded'))
        })
}

// types

export type TodolistsActionType = ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeFilterAC>
    | ReturnType<typeof changeEntityStatusAC>
    | removeTodolistACType
    | addTodolistACType
    | getTodolitsACType


export type getTodolitsACType = ReturnType<typeof getTodolitsAC>
export type addTodolistACType = ReturnType<typeof addTodolistAC>
export type removeTodolistACType = ReturnType<typeof removeTodolistAC>


export type FilterValueType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: RequestStatusType
}
import {v1} from "uuid";
import {addTodolistACType, removeTodolistACType} from "./TodolistsReducer";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/todolist-api";

export type TasksType = {
    [key: string]: Array<TaskType>
}

const initialState: TasksType = {}

export const tasksReducer = (state: TasksType = initialState, action: GeneralType):TasksType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].filter(f => f.id !== action.payload.id)
            }
        case "ADD-TASK":
            let newTask: TaskType = {id: v1(), title: action.payload.title,
                status: TaskStatuses.New, addedDate: '', deadline: '', description: '', startDate: '',
            order: 0, priority: TaskPriorities.Low, todoListId: action.payload.todolistID}
            return {...state, [action.payload.todolistID]: [newTask, ...state[action.payload.todolistID]]}
        case "CHANGE-TASK-STATUS" :
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].map(m => m.id === action.payload.taskID ? {
                    ...m,
                    status: action.payload.status
                } : m)
            }
        case "CHANGE-TASK-TITLE" :
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].map(m => m.id === action.payload.taskID ? {
                    ...m,
                    title: action.payload.title
                } : m)
            }
        case "REMOVE-TODOLIST":
            const copyState = {...state}
            delete copyState[action.payload.todolistID]
            return copyState
        case "ADD-TODOLIST":
            return {...state, [action.payload.todolistID]: []}
        default :
            return state
    }

}


type GeneralType = removeTaskACType | addTaskACType | changeTaskStatusACType
    | changeTaskTitleACType | addTodolistACType | removeTodolistACType

type removeTaskACType = ReturnType<typeof removeTaskAC>

export const removeTaskAC = (id: string, todolistID: string) => {
    return {
        type: "REMOVE-TASK",
        payload: {
            id,
            todolistID,
        }
    } as const
}

type addTaskACType = ReturnType<typeof addTaskAC>

export const addTaskAC = (title: string, todolistID: string) => {
    return {
        type: "ADD-TASK",
        payload: {
            title,
            todolistID,
        }
    } as const
}

type changeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>

export const changeTaskStatusAC = (todolistID: string, taskID: string, status: TaskStatuses) => {
    return {
        type: "CHANGE-TASK-STATUS",
        payload: {
            taskID,
            status,
            todolistID
        }
    } as const
}

type changeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>

export const changeTaskTitleAC = (todolistID: string, taskID: string, title: string) => {
    return {
        type: "CHANGE-TASK-TITLE",
        payload: {
            todolistID,
            taskID,
            title,
        }
    } as const
}



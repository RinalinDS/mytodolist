import {addTodolistACType, getTodolitsACType, removeTodolistACType} from "./TodolistsReducer";
import {TaskStatuses, TaskType, todolistApi, UpdateTaskModelType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

// INIT STATE

const initialState: TasksType = {}

// REDUCER

export const tasksReducer = (state: TasksType = initialState, action: GeneralType): TasksType => {
    switch (action.type) {
        case "REMOVE-TASK":
            debugger
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].filter(f => f.id !== action.payload.id)
            }
        case "ADD-TASK":
            return {
                ...state,
                [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]]
            }
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
            return {...state, [action.payload.todolist.id]: []}
        case "GET-TODOLISTS": {
            const copyState = {...state}
            action.payload.todolists.forEach(m => {
                copyState[m.id] = []
            })
            return copyState
        }
        case "SET-TASKS":
            return {...state, [action.payload.todolistID]: action.payload.tasks}

        default :
            return state
    }

}

/// ACTION CREATORS AND TYPES

export type TasksType = {
    [key: string]: Array<TaskType>
}

type GeneralType = removeTaskACType | addTaskACType | changeTaskStatusACType
    | changeTaskTitleACType | addTodolistACType | removeTodolistACType | getTodolitsACType | getTasksACType

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

export const addTaskAC = (task: TaskType) => {
    return {
        type: "ADD-TASK",
        payload: {
            task,

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

export const getTasksAC = (tasks: Array<TaskType>, todolistID: string) => {
    return {
        type: "SET-TASKS",
        payload: {
            tasks,
            todolistID
        }
    } as const
}
export type getTasksACType = ReturnType<typeof getTasksAC>


// thunk

export const getTasksTC = (todolistID: string) => (dispatch: Dispatch) => {
    todolistApi.getTasks(todolistID)
        .then((res) => {
            dispatch(getTasksAC(res.data.items, todolistID))
        })
}

export const removeTaskTC = (todolistID: string, taskID: string) => (dispatch: Dispatch) => {
    todolistApi.deleteTask(todolistID, taskID)
        .then(() => {
            debugger
            dispatch(removeTaskAC(taskID, todolistID))
        })
}

export const addTaskTC = (todolistID: string, title: string) => (dispatch: Dispatch) => {
    todolistApi.createTask(todolistID, title)
        .then((res) => {
            debugger
            dispatch(addTaskAC(res.data.data.item))
        })
}

export const updateTaskStatusTC = (todolistID: string, taskID: string, status: TaskStatuses) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const allTasks = getState().tasks
        const tasksForCurrentList = allTasks[todolistID]
        const task = tasksForCurrentList.find(f => f.id === taskID)

        if (task) {
            // const model: UpdateTaskModelType = {...task, status}
            // верхнюю бэкенд тоже проглотил, но это плохая практика, потому что сервер запрашивает таску
            // без некоторых свойств , и не надо нагружать лишней инфой запрос
            const model: UpdateTaskModelType = {
                title: task.title,
                description: task.description,
                status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
            }
            debugger
            todolistApi.updateTask(todolistID, taskID, model)
                .then(res => {
                    dispatch(changeTaskStatusAC(todolistID, taskID, status))
                })
        }
    }

export const changeTaskTitleTC = (task: TaskType, title: string) => (dispatch: Dispatch) => {
    const model: UpdateTaskModelType = {
        title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
    }
    todolistApi.updateTask(task.todoListId, task.id, model)
        .then((res) => {
            dispatch(changeTaskTitleAC(task.todoListId, task.id, title))
        })
}
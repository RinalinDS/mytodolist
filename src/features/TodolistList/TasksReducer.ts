import {addTodolistACType, getTodolitsACType, removeTodolistACType} from "./TodolistsReducer";
import {TaskType, todolistApi, UpdateTaskModelType} from "../../api/todolist-api";
import {ThunkType} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/AppReducer";
import {handlerServerError, handleServerNetworkError} from "../../utils/error-utils";

// INIT STATE

const initialState: TasksType = {}

// REDUCER

export const tasksReducer = (state: TasksType = initialState, action: TasksActionType): TasksType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].filter(f => f.id !== action.payload.id)
            }
        case "ADD-TASK":
            return {
                ...state,
                [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]]
            }
        case "UPDATE-TASK":
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].map(m => m.id === action.payload.taskID ?
                    {...m, ...action.payload.domainModel} : m)
            }
        case "CHANGE-TASK-ENTITY-STATUS":
            return {
                ...state,
                [action.payload.todolistID]: state[action.payload.todolistID].map(m => m.id === action.payload.taskID ?
                    {...m, entityStatus: action.payload.entityStatus} : m)
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

/// ACTION CREATORS

export const removeTaskAC = (id: string, todolistID: string) => ({
    type: "REMOVE-TASK",
    payload: {
        id,
        todolistID,
    }
} as const)

export const addTaskAC = (task: TaskType) => ({
    type: "ADD-TASK",
    payload: {
        task,

    }
} as const)

export const updateTaskAC = (todolistID: string, taskID: string, domainModel: UpdateTaskModelDomainType) => ({
    type: "UPDATE-TASK",
    payload: {
        todolistID,
        taskID,
        domainModel,
    }
} as const)

export const getTasksAC = (tasks: Array<TaskType>, todolistID: string) => ({
    type: "SET-TASKS",
    payload: {
        tasks,
        todolistID
    }
} as const)

export const changeTaskEntityStatusAC = (entityStatus: RequestStatusType, todolistID: string, taskID: string) => ({
    type: "CHANGE-TASK-ENTITY-STATUS",
    payload: {
        entityStatus,
        todolistID,
        taskID
    }
} as const)


// thunk

export const getTasksTC = (todolistID: string): ThunkType => async dispatch => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await todolistApi.getTasks(todolistID)
        dispatch(getTasksAC(res.data.items, todolistID))
        dispatch(setAppStatusAC('succeeded'))
    } catch (e) {
        console.warn(e)
    }
}

export const removeTaskTC = (todolistID: string, taskID: string): ThunkType => async dispatch => {
    try {
        dispatch(changeTaskEntityStatusAC('loading',todolistID, taskID))
        dispatch(setAppStatusAC('loading'))
        const res = await todolistApi.deleteTask(todolistID, taskID)
        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC(taskID, todolistID))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handlerServerError(res.data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e.message, dispatch)
    }
}

export const updateTaskTC = (task: TaskType, domainModel: UpdateTaskModelDomainType): ThunkType => async dispatch => {
    try {
        dispatch(changeTaskEntityStatusAC('loading',task.todoListId, task.id))
        dispatch(setAppStatusAC('loading'))
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...domainModel
        }
        const res = await todolistApi.updateTask(task.todoListId, task.id, apiModel)
        if (res.data.resultCode === 0) {
            dispatch(updateTaskAC(task.todoListId, task.id, domainModel))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handlerServerError(res.data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e.message, dispatch)
    }
    finally {
        dispatch(changeTaskEntityStatusAC('idle',task.todoListId, task.id))
    }
}

export const addTaskTC = (todolistID: string, title: string): ThunkType => async dispatch => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await todolistApi.createTask(todolistID, title)
        if (res.data.resultCode === 0) {
            dispatch(addTaskAC(res.data.data.item))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handlerServerError<{ item: TaskType }>(res.data, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e.message, dispatch)
    }
}

/*// TYPE GUARD ?
function isAxiosError(some : any): some is AxiosError {
    return some.isAxiosError === true
}*/


/*export const updateTaskStatusTC = (todolistID: string, taskID: string, status: TaskStatuses) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const allTasks = getState().tasks
        const tasksForCurrentList = allTasks[todolistID]
        const task = tasksForCurrentList.find(f => f.id === taskID)

        if (task) {
            // const model: UpdateTaskModelType = {...task, status}
            // верхнюю backend тоже проглотил, но это плохая практика, потому что сервер запрашивает таску
            // без некоторых свойств , и не надо нагружать лишней информацией запрос
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
    }*/

// export const changeTaskTitleTC = (task: TaskType, title: string) => (dispatch: Dispatch) => {
//     const model: UpdateTaskModelType = {
//         title,
//         description: task.description,
//         status: task.status,
//         priority: task.priority,
//         startDate: task.startDate,
//         deadline: task.deadline,
//     }
//     todolistApi.updateTask(task.todoListId, task.id, model)
//         .then((res) => {
//             dispatch(changeTaskTitleAC(task.todoListId, task.id, title))
//         })
// }

// types
export type TasksActionType =
    ReturnType<typeof removeTaskAC> |
    ReturnType<typeof addTaskAC> |
    ReturnType<typeof updateTaskAC> |
    ReturnType<typeof getTasksAC> |
    ReturnType<typeof changeTaskEntityStatusAC> |
    addTodolistACType |
    removeTodolistACType |
    getTodolitsACType

export type TasksType = {
    [key: string]: Array<TaskType>
}


// Тип внизу, создан для того чтобы можно было объединить changeTitle и changeStatus, чтобы они диспатчили
//  один объект в котором будет объект с нужным свойством, либо title, либо status, а все остальные взять по дефолту.
export type UpdateTaskModelDomainType = {
    title?: string
    description?: string
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}
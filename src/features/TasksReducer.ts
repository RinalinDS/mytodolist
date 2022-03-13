import {addTodolistACType, getTodolitsACType, removeTodolistACType} from "./TodolistsReducer";
import {TaskType, todolistApi, UpdateTaskModelType} from "../api/todolist-api";
import {Dispatch} from "redux";

// INIT STATE

const initialState: TasksType = {}

// REDUCER

export const tasksReducer = (state: TasksType = initialState, action: GeneralType): TasksType => {
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

export const updateTaskTC = (task: TaskType, domainModel: UpdateTaskModelDomainType) => (dispatch: Dispatch) => {
    const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...domainModel
    }
    todolistApi.updateTask(task.todoListId, task.id, apiModel)
        .then((res) => {
            dispatch(updateTaskAC(task.todoListId, task.id, domainModel))
        })
}

/*export const updateTaskStatusTC = (todolistID: string, taskID: string, status: TaskStatuses) =>
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
type GeneralType =
    ReturnType<typeof removeTaskAC> |
    ReturnType<typeof addTaskAC> |
    ReturnType<typeof updateTaskAC> |
    ReturnType<typeof getTasksAC> |
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
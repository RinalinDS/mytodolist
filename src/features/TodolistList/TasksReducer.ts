import {addTodolistAC, clearTodolistsDataAC, getTodolitsAC, removeTodolistAC} from "./TodolistsReducer";
import {TaskType, todolistApi, UpdateTaskModelType} from "../../api/todolist-api";
import {ThunkType} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/AppReducer";
import {handlerServerError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

// INIT STATE

const initialState: TasksType = {}

// REDUCER
const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        removeTaskAC: (state, action: PayloadAction<{ taskID: string, todolistID: string }>) => {
            const index = state[action.payload.todolistID].findIndex(s => s.id === action.payload.taskID)
            state[action.payload.todolistID].splice(index, 1)
        },
        addTaskAC: (state, action: PayloadAction<{ task: TaskType }>) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC: (state, action: PayloadAction<{ todolistID: string, taskID: string, domainModel: UpdateTaskModelDomainType }>) => {
            const tasks = state[action.payload.todolistID]
            const index = tasks.findIndex(s => s.id === action.payload.taskID)
            tasks[index] = {...tasks[index], ...action.payload.domainModel}
        },
        getTasksAC: (state, action: PayloadAction<{ tasks: Array<TaskType>, todolistID: string }>) => {
            state[action.payload.todolistID] = action.payload.tasks
        },
        changeTaskEntityStatusAC: (state, action: PayloadAction<{ entityStatus: RequestStatusType, todolistID: string, taskID: string }>) => {
            const index = state[action.payload.todolistID].findIndex(s => s.id === action.payload.taskID)
            state[action.payload.todolistID][index].entityStatus = action.payload.entityStatus
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(removeTodolistAC, (state, action) => {
                delete state[action.payload.todolistID]
            })

            .addCase(addTodolistAC, (state, action) => {
                state[action.payload.todolist.id] = []
            })

            .addCase(clearTodolistsDataAC, () => {
                return {}
            })
            .addCase(getTodolitsAC, (state, action) => {
                action.payload.todolists.forEach((m: any) => {
                    state[m.id] = []
                })

            })
    },
})

export const tasksReducer = slice.reducer


// ACTION CREATORS
export const {removeTaskAC, addTaskAC, updateTaskAC, getTasksAC, changeTaskEntityStatusAC} = slice.actions


// thunk

export const getTasksTC =  createAsyncThunk('tasks/getTasks', async (todolistID: string, {dispatch, ...thunkAPI})=> {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todolistApi.getTasks(todolistID)
        dispatch(getTasksAC({tasks: res.data.items, todolistID}))
    } catch (e) {
        handleServerNetworkError((e as Error).message, dispatch)
    } finally {
        dispatch(setAppStatusAC({status: 'idle'}))
    }
})

// export const getTasksTC_ = (todolistID: string): ThunkType => async dispatch => {
//     try {
//         dispatch(setAppStatusAC({status: 'loading'}))
//         const res = await todolistApi.getTasks(todolistID)
//         dispatch(getTasksAC({tasks: res.data.items, todolistID}))
//
//     } catch (e) {
//         handleServerNetworkError((e as Error).message, dispatch)
//     } finally {
//         dispatch(setAppStatusAC({status: 'idle'}))
//     }
// }

export const removeTaskTC = (todolistID: string, taskID: string): ThunkType => async dispatch => {
    try {
        dispatch(changeTaskEntityStatusAC({entityStatus: 'loading', todolistID, taskID}))
        dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todolistApi.deleteTask(todolistID, taskID)
        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC({taskID, todolistID}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handlerServerError(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError((e as Error).message, dispatch)
    }
}

export const updateTaskTC = (task: TaskType, domainModel: UpdateTaskModelDomainType): ThunkType => async dispatch => {
    try {
        dispatch(changeTaskEntityStatusAC({entityStatus: 'loading', todolistID: task.todoListId, taskID: task.id}))
        dispatch(setAppStatusAC({status: 'loading'}))
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
            dispatch(updateTaskAC({todolistID: task.todoListId, taskID: task.id, domainModel}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handlerServerError<{ item: TaskType }>(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError((e as Error).message, dispatch)
    } finally {
        dispatch(changeTaskEntityStatusAC({entityStatus: 'idle', todolistID: task.todoListId, taskID: task.id}))
    }
}

export const addTaskTC = (todolistID: string, title: string): ThunkType => async dispatch => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todolistApi.createTask(todolistID, title)
        if (res.data.resultCode === 0) {
            dispatch(addTaskAC({task: res.data.data.item}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } else {
            handlerServerError<{ item: TaskType }>(res.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError((e as Error).message, dispatch)
    }
}


// util types

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
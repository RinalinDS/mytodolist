import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  RejectValueType,
  RequestStatusType,
  TasksType,
  TaskType,
  TodolistType,
  UpdateTaskModelDomainType,
  UpdateTaskModelType
} from '../../types';
import {taskAPI} from '../../api/API';
import {handleAsyncServerError, handleAsyncServerNetworkError} from '../../utils/error-utils';
import {StatusCode} from '../../enums';

import {addTodolist, clearTodolistsData, getTodolists, removeTodolist} from './TodolistsReducer';
import {setAppStatus} from './AppReducer';




export const getTasks = createAsyncThunk<{ tasks: TaskType[], todolistID: string }, string, RejectValueType>('tasks/getTasks', async (todolistID, thunkAPI) => {
  const {dispatch} = thunkAPI
  try {
    dispatch(setAppStatus({status: 'loading'}))
    const res = await taskAPI.getTasks(todolistID)
    return {tasks: res.data.items, todolistID}
  } catch (e) {
    return handleAsyncServerNetworkError((e as Error).message, thunkAPI)
  } finally {
    dispatch(setAppStatus({status: 'idle'}))
  }
})
export const removeTask = createAsyncThunk<{ todolistID: string, taskID: string }, { todolistID: string, taskID: string }, RejectValueType>('tasks/removeTask', async (param, thunkAPI) => {
  const {dispatch} = thunkAPI
  try {
    dispatch(setAppStatus({status: 'loading'}))
    const res = await taskAPI.deleteTask(param.todolistID, param.taskID)
    if (res.data.resultCode === StatusCode.Success) {
      return {todolistID: param.todolistID, taskID: param.taskID}
    } else {
      return handleAsyncServerError(res.data, thunkAPI)
    }
  } catch (e) {
    return handleAsyncServerNetworkError((e as Error).message, thunkAPI)
  } finally {
    dispatch(setAppStatus({status: 'idle'}))
  }
})

export const addTask = createAsyncThunk<TaskType, { todolistID: string, title: string }, RejectValueType>('tasks/addTask', async (param, thunkAPI) => {
  const {dispatch} = thunkAPI
  try {
    dispatch(setAppStatus({status: 'loading'}))
    const res = await taskAPI.createTask(param.todolistID, param.title)
    if (res.data.resultCode === StatusCode.Success) {
      dispatch(setAppStatus({status: 'succeeded'}))
      return res.data.data.item
    } else {
      return handleAsyncServerError(res.data, thunkAPI)
    }
  } catch (e) {
    return handleAsyncServerNetworkError((e as Error).message, thunkAPI, false)
  }
})
export const updateTask = createAsyncThunk<{ todolistID: string, taskID: string, domainModel: UpdateTaskModelDomainType }, { task: TaskType, domainModel: UpdateTaskModelDomainType }, RejectValueType>('tasks/updateTask', async (param, thunkAPI) => {
  const {dispatch} = thunkAPI
  try {
    dispatch(changeTaskEntityStatus({
      entityStatus: 'loading',
      todolistID: param.task.todoListId,
      taskID: param.task.id
    }))
    dispatch(setAppStatus({status: 'loading'}))
    const apiModel: UpdateTaskModelType = {
      title: param.task.title,
      description: param.task.description,
      status: param.task.status,
      priority: param.task.priority,
      startDate: param.task.startDate,
      deadline: param.task.deadline,
      ...param.domainModel
    }
    const res = await taskAPI.updateTask(param.task.todoListId, param.task.id, apiModel)
    if (res.data.resultCode === StatusCode.Success) {
      dispatch(setAppStatus({status: 'succeeded'}))
      return {todolistID: param.task.todoListId, taskID: param.task.id, domainModel: param.domainModel}
    } else {
      return handleAsyncServerError<{ item: TaskType }>(res.data, thunkAPI)
    }
  } catch (e) {
    return handleAsyncServerNetworkError((e as Error).message, thunkAPI,)
  } finally {
    dispatch(changeTaskEntityStatus({entityStatus: 'idle', todolistID: param.task.todoListId, taskID: param.task.id}))
  }
})


// REDUCER
export const slice = createSlice({
  name: 'tasks',
  initialState: {} as TasksType,
  reducers: {
    changeTaskEntityStatus: (state, action: PayloadAction<{ entityStatus: RequestStatusType, todolistID: string, taskID: string }>) => {
      const index = state[action.payload.todolistID].findIndex(s => s.id === action.payload.taskID)
      state[action.payload.todolistID][index].entityStatus = action.payload.entityStatus
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload]
      })

      .addCase(addTodolist.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })

      .addCase(clearTodolistsData, () => {
        return {}
      })
      .addCase(getTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((m: TodolistType) => {
          state[m.id] = []
        })
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state[action.payload.todolistID] = action.payload.tasks
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const index = state[action.payload.todolistID].findIndex(s => s.id === action.payload?.taskID)
        state[action.payload.todolistID].splice(index, 1)
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift(action.payload)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistID]
        const index = tasks.findIndex(s => s.id === action.payload.taskID)
        tasks[index] = {...tasks[index], ...action.payload.domainModel}
      })

  },
})

export const tasksReducer = slice.reducer

// ACTION CREATORS
export const {changeTaskEntityStatus} = slice.actions

export const TaskActions = {
  getTasks,
  removeTask,
  addTask,
  updateTask,
  changeTaskEntityStatusAC: changeTaskEntityStatus,
}






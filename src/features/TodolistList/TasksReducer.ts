import {clearTodolistsDataAC, createTodolistTC, deleteTodolistTC, getTodolistsTC} from "./TodolistsReducer";
import {taskAPI} from "../../api/API";
import {setAppStatusAC} from "../../app/AppReducer";
import {handlerServerError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RequestStatusType, TasksType, TaskType, UpdateTaskModelDomainType, UpdateTaskModelType} from '../../types';


export const getTasksTC = createAsyncThunk('tasks/getTasks', async (todolistID: string, {dispatch}) => {
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await taskAPI.getTasks(todolistID)
    return {tasks: res.data.items, todolistID}
  } catch (e) {
    handleServerNetworkError((e as Error).message, dispatch)
  } finally {
    dispatch(setAppStatusAC({status: 'idle'}))
  }
})

export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: { todolistID: string, taskID: string }, {
  dispatch
}) => {
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await taskAPI.deleteTask(param.todolistID, param.taskID)
    if (res.data.resultCode === 0) {
      return {todolistID: param.todolistID, taskID: param.taskID}
    } else {
      handlerServerError(res.data, dispatch)
    }
  } catch (e) {
    handleServerNetworkError((e as Error).message, dispatch)
  } finally {
    dispatch(setAppStatusAC({status: 'idle'}))
  }
})

export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: { todolistID: string, title: string }, {
  dispatch,
  rejectWithValue
}) => {
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await taskAPI.createTask(param.todolistID, param.title)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      return res.data.data.item
    } else {
      handlerServerError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError((e as Error).message, dispatch)
    return rejectWithValue(null)
  }
})

export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (param: { task: TaskType, domainModel: UpdateTaskModelDomainType }, {
  dispatch,
  rejectWithValue
}) => {
  try {
    dispatch(changeTaskEntityStatusAC({
      entityStatus: 'loading',
      todolistID: param.task.todoListId,
      taskID: param.task.id
    }))
    dispatch(setAppStatusAC({status: 'loading'}))
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
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      return {todolistID: param.task.todoListId, taskID: param.task.id, domainModel: param.domainModel}
    } else {
      handlerServerError<{ item: TaskType }>(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError((e as Error).message, dispatch)
    return rejectWithValue(null)
  } finally {
    dispatch(changeTaskEntityStatusAC({entityStatus: 'idle', todolistID: param.task.todoListId, taskID: param.task.id}))
  }
})


// REDUCER
const slice = createSlice({
  name: 'tasks',
  initialState: {} as TasksType,
  reducers: {
    changeTaskEntityStatusAC: (state, action: PayloadAction<{ entityStatus: RequestStatusType, todolistID: string, taskID: string }>) => {
      const index = state[action.payload.todolistID].findIndex(s => s.id === action.payload.taskID)
      state[action.payload.todolistID][index].entityStatus = action.payload.entityStatus
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload]
      })

      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })

      .addCase(clearTodolistsDataAC, () => {
        return {}
      })
      .addCase(getTodolistsTC.fulfilled, (state, action) => {
        action.payload.todolists.forEach((m) => {
          state[m.id] = []
        })
      })
      .addCase(getTasksTC.fulfilled, (state, action) => {
        if (action.payload) {
          state[action.payload.todolistID] = action.payload.tasks
        }
      })
      .addCase(removeTaskTC.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state[action.payload.todolistID].findIndex(s => s.id === action.payload?.taskID)
          state[action.payload.todolistID].splice(index, 1)
        }
      })
      .addCase(addTaskTC.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift(action.payload)
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistID]
        const index = tasks.findIndex(s => s.id === action.payload.taskID)
        tasks[index] = {...tasks[index], ...action.payload.domainModel}
      })

  },
})

export const tasksReducer = slice.reducer


// ACTION CREATORS
export const {changeTaskEntityStatusAC} = slice.actions






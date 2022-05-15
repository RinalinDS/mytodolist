import {addTodolistAC, clearTodolistsDataAC, getTodolitsAC, removeTodolistAC} from "./TodolistsReducer";
import { todolistApi } from "../../api/todolist-api";
import {ThunkType} from "../../app/store";
import { setAppStatusAC} from "../../app/AppReducer";
import {handlerServerError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RequestStatusType, TasksType, TaskType, UpdateTaskModelDomainType, UpdateTaskModelType} from '../../types';


export const getTasksTC = createAsyncThunk('tasks/getTasks', async (todolistID: string, {dispatch}) => {
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistApi.getTasks(todolistID)
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
    const res = await todolistApi.deleteTask(param.todolistID, param.taskID)
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
    const res = await todolistApi.createTask(param.todolistID, param.title)
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

// REDUCER
const slice = createSlice({
  name: 'tasks',
  initialState: {} as TasksType,
  reducers: {
    updateTaskAC: (state, action: PayloadAction<{ todolistID: string, taskID: string, domainModel: UpdateTaskModelDomainType }>) => {
      const tasks = state[action.payload.todolistID]
      const index = tasks.findIndex(s => s.id === action.payload.taskID)
      tasks[index] = {...tasks[index], ...action.payload.domainModel}
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

  },
})

export const tasksReducer = slice.reducer


// ACTION CREATORS
export const {updateTaskAC, changeTaskEntityStatusAC} = slice.actions






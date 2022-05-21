import {addTodolist,  clearTodolistsData, getTodolists, removeTodolist} from "./TodolistsReducer";
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  FieldsErrorsType,
  RequestStatusType,
  TasksType,
  TaskType,
  UpdateTaskModelDomainType,
  UpdateTaskModelType
} from '../../types';
import {setAppStatusAC} from './AppReducer';
import {taskAPI} from '../../api/API';
import {handlerServerError, handleServerNetworkError} from '../../utils/error-utils';


export const getTasks = createAsyncThunk('tasks/getTasks', async (todolistID: string, {dispatch}) => {
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
export const removeTask = createAsyncThunk('tasks/removeTask', async (param: { todolistID: string, taskID: string }, {
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
export const addTask = createAsyncThunk<TaskType, { todolistID: string, title: string },  { rejectValue: { errors: Array<string>, fieldsError?: FieldsErrorsType[] } }>('tasks/addTask', async (param, {
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
      handlerServerError(res.data, dispatch, false)
      return rejectWithValue({errors: res.data.messages, fieldsError: res.data.fieldsErrors}) // выплюнуть action с типом rejected, v reduxe я его не обрабатываю, хотя можно, но использую его в формике. Еррорс попадает в пейлоад actiona-a
    }
  } catch (e) {
    handleServerNetworkError((e as Error).message, dispatch, false)
    return rejectWithValue({errors: [(e as Error).message], fieldsError: undefined})
  }
})
export const updateTask = createAsyncThunk('tasks/updateTask', async (param: { task: TaskType, domainModel: UpdateTaskModelDomainType }, {
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

export const asyncActions = {
  getTasks,
  removeTask,
  addTask,
  updateTask,
}

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
        action.payload.todolists.forEach((m) => {
          state[m.id] = []
        })
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        if (action.payload) {
          state[action.payload.todolistID] = action.payload.tasks
        }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state[action.payload.todolistID].findIndex(s => s.id === action.payload?.taskID)
          state[action.payload.todolistID].splice(index, 1)
        }
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
export const {changeTaskEntityStatusAC} = slice.actions






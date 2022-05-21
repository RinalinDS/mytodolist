import {createAsyncThunk} from '@reduxjs/toolkit';
import {setAppStatusAC} from '../AppReducer';
import {taskAPI} from '../../../api/API';
import {handlerServerError, handleServerNetworkError} from '../../../utils/error-utils';
import {TaskType, UpdateTaskModelDomainType, UpdateTaskModelType} from '../../../types';
import {changeTaskEntityStatusAC} from '../TasksReducer';

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
export const addTask = createAsyncThunk('tasks/addTask', async (param: { todolistID: string, title: string }, {
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
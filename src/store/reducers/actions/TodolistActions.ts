import {createAsyncThunk} from '@reduxjs/toolkit';
import {setAppStatusAC} from '../AppReducer';
import {todolistApi} from '../../../api/API';
import {handlerServerError, handleServerNetworkError} from '../../../utils/error-utils';
import {TodolistType} from '../../../types';
import {changeEntityStatus} from '../TodolistsReducer';
import {getTasks} from './TaskActions';

export const getTodolists = createAsyncThunk('todolists/getTodos', async (param, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistApi.getTodos()
    res.data.forEach(tl => {
      dispatch(getTasks(tl.id))
    })
    dispatch(setAppStatusAC({status: 'succeeded'}))
    return {todolists: res.data}
  } catch (e) {
    handleServerNetworkError((e as Error).message, dispatch)
    return rejectWithValue(null)
  }
})

export const removeTodolist = createAsyncThunk('todolists/deleteTodo', async (todolistID: string, {
    dispatch,
    rejectWithValue
  }) => {
    try {
      dispatch(setAppStatusAC({status: 'loading'}))
      dispatch(changeEntityStatus({entityStatus: 'loading', todolistID}))
      const res = await todolistApi.deleteTodo(todolistID)
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return todolistID
      } else {
        handlerServerError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (e) {
      handleServerNetworkError((e as Error).message, dispatch)
      return rejectWithValue(null)
    }
  })

export const addTodolist = createAsyncThunk('todolists/createTodo', async (title: string, {
  dispatch,
  rejectWithValue
}) => {
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistApi.createTodo(title)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      return res.data.data.item
    } else {
      handlerServerError<{ item: TodolistType }>(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError((e as Error).message, dispatch)
    return rejectWithValue(null)
  }
})

export const changeTodolistTitle = createAsyncThunk('todolists/changeTodoTitle', async (param: { todolistID: string, title: string }, {
  dispatch,
  rejectWithValue
}) => {
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistApi.updateTodoTitle(param.title, param.todolistID)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      return {todolistID: param.todolistID, title: param.title}
    } else {
      handlerServerError(res.data, dispatch)
      return rejectWithValue(null)
    }
  } catch (e) {
    handleServerNetworkError((e as Error).message, dispatch)
    return rejectWithValue(null)
  }
})
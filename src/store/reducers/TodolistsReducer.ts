import {todolistApi} from "../../api/API";
import {setAppStatusAC} from "./AppReducer";
import {handlerServerError, handleServerNetworkError} from "../../utils/error-utils";
import {getTasksTC} from './TasksReducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FilterValueType, RequestStatusType, TodolistDomainType, TodolistType} from '../../types';


export const getTodolistsTC = createAsyncThunk('todolists/getTodos', async (param, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistApi.getTodos()
    res.data.forEach(tl => {
      dispatch(getTasksTC(tl.id))
    })
    dispatch(setAppStatusAC({status: 'succeeded'}))
    return {todolists: res.data}
  } catch (e) {
    handleServerNetworkError((e as Error).message, dispatch)
    return rejectWithValue(null)
  }
})


export const deleteTodolistTC = createAsyncThunk('todolists/deleteTodo', async (todolistID: string, {
    dispatch,
    rejectWithValue
  }) => {
    try {
      dispatch(setAppStatusAC({status: 'loading'}))
      dispatch(changeEntityStatusAC({entityStatus: 'loading', todolistID}))
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
  }
)

export const createTodolistTC = createAsyncThunk('todolists/createTodo', async (title: string, {
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

export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodoTitle', async (param: { todolistID: string, title: string }, {
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


const slice = createSlice({
  name: 'todolists',
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeFilterAC: (state, action: PayloadAction<{ filter: FilterValueType, todolistID: string }>) => {
      const index = state.findIndex(s => s.id === action.payload.todolistID)
      state[index].filter = action.payload.filter
    },
    changeEntityStatusAC: (state, action: PayloadAction<{ entityStatus: RequestStatusType, todolistID: string }>) => {
      const index = state.findIndex(s => s.id === action.payload.todolistID)
      state[index].entityStatus = action.payload.entityStatus
    },
    clearTodolistsDataAC: () => {
      return []
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getTodolistsTC.fulfilled, (state, action) => {
        return action.payload.todolists.map(m => ({...m, filter: "all", entityStatus: 'idle'}))
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex(s => s.id === action.payload)
        state.splice(index, 1)
      })
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state.unshift({...action.payload, filter: 'all', entityStatus: 'idle'})
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex(s => s.id === action.payload.todolistID)
        state[index].title = action.payload.title
      })
  }
})

export const todolistsReducer = slice.reducer

export const {
  changeFilterAC,
  changeEntityStatusAC,
  clearTodolistsDataAC,
} = slice.actions




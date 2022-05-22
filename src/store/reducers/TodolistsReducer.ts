import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FilterValueType, RejectValueType, RequestStatusType, TodolistDomainType, TodolistType} from '../../types';
import {handleAsyncServerError, handleServerNetworkError} from '../../utils/error-utils';
import {todolistApi} from '../../api/API';
import {setAppStatusAC} from './AppReducer';
import {getTasks} from './TasksReducer';


export const getTodolists = createAsyncThunk('todolists/getTodos', async (param, thunkAPI) => {
  const {dispatch} = thunkAPI
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistApi.getTodos()
    res.data.forEach(tl => {
      dispatch(getTasks(tl.id))
    })
    dispatch(setAppStatusAC({status: 'succeeded'}))
    return {todolists: res.data}
  } catch (e) {
    return handleServerNetworkError((e as Error).message, thunkAPI, false)
  }
})

export const removeTodolist = createAsyncThunk('todolists/deleteTodo', async (todolistID: string, thunkAPI) => {
  const {dispatch} = thunkAPI
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeEntityStatus({entityStatus: 'loading', todolistID}))
    const res = await todolistApi.deleteTodo(todolistID)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      return todolistID
    } else {
      return handleAsyncServerError(res.data, thunkAPI)
    }
  } catch (e) {
    return handleServerNetworkError((e as Error).message, thunkAPI)
  }
})

export const addTodolist = createAsyncThunk<TodolistType, string, RejectValueType>('todolists/createTodo', async (title, thunkAPI) => {
  const {dispatch} = thunkAPI
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistApi.createTodo(title)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      return res.data.data.item
    } else {
      return handleAsyncServerError<{ item: TodolistType }>(res.data, thunkAPI)
    }
  } catch (e) {
    return handleServerNetworkError((e as Error).message, thunkAPI, false)
  }
})

export const changeTodolistTitle = createAsyncThunk('todolists/changeTodoTitle', async (param: { todolistID: string, title: string }, thunkAPI) => {
  const {dispatch} = thunkAPI
  try {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistApi.updateTodoTitle(param.title, param.todolistID)
    if (res.data.resultCode === 0) {
      dispatch(setAppStatusAC({status: 'succeeded'}))
      return {todolistID: param.todolistID, title: param.title}
    } else {
      return handleAsyncServerError(res.data, thunkAPI)
    }
  } catch (e) {
    return handleServerNetworkError((e as Error).message, thunkAPI)
  }
})

export const asyncActions = {
  getTodolists,
  removeTodolist,
  addTodolist,
  changeTodolistTitle,
}

export const slice = createSlice({
  name: 'todolists',
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeFilter: (state, action: PayloadAction<{ filter: FilterValueType, todolistID: string }>) => {
      const index = state.findIndex(s => s.id === action.payload.todolistID)
      state[index].filter = action.payload.filter
    },
    changeEntityStatus: (state, action: PayloadAction<{ entityStatus: RequestStatusType, todolistID: string }>) => {
      const index = state.findIndex(s => s.id === action.payload.todolistID)
      state[index].entityStatus = action.payload.entityStatus
    },
    clearTodolistsData: () => {
      return []
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((m: TodolistType) => ({...m, filter: "all", entityStatus: 'idle'}))
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex(s => s.id === action.payload)
        state.splice(index, 1)
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({...action.payload, filter: 'all', entityStatus: 'idle'})
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex(s => s.id === action.payload.todolistID)
        state[index].title = action.payload.title
      })
  }
})

export const todolistsReducer = slice.reducer

export const {
  changeFilter,
  changeEntityStatus,
  clearTodolistsData,
} = slice.actions




import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FilterValueType, RequestStatusType, TodolistDomainType, TodolistType} from '../../types';
import {handlerServerError, handleServerNetworkError} from '../../utils/error-utils';
import {todolistApi} from '../../api/API';
import {setAppStatusAC} from './AppReducer';
import {getTasks} from './TasksReducer';


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
        return action.payload.todolists.map(m => ({...m, filter: "all", entityStatus: 'idle'}))
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




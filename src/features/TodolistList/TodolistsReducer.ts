import {todolistApi} from "../../api/todolist-api";
import {ThunkType} from "../../app/store";
import {setAppStatusAC} from "../../app/AppReducer";
import {AxiosError} from "axios";
import {handlerServerError, handleServerNetworkError} from "../../utils/error-utils";
import {getTasksTC} from './TasksReducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RequestStatusType, TodolistType} from '../../types';

//initial state

const initialState: Array<TodolistDomainType> = []

//reducer

const slice = createSlice({
  name: 'todolist',
  initialState: initialState,
  reducers: {
    changeTodolistTitleAC: (state, action: PayloadAction<{ todolistID: string, title: string }>) => {
      const index = state.findIndex(s => s.id === action.payload.todolistID)
      state[index].title = action.payload.title
    },
    changeFilterAC: (state, action: PayloadAction<{ filter: FilterValueType, todolistID: string }>) => {
      const index = state.findIndex(s => s.id === action.payload.todolistID)
      state[index].filter = action.payload.filter
    },
    removeTodolistAC: (state, action: PayloadAction<{ todolistID: string }>) => {
      const index = state.findIndex(s => s.id === action.payload.todolistID)
      state.splice(index, 1)
    },
    addTodolistAC: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
    },
    getTodolitsAC: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
      return action.payload.todolists.map(m => ({...m, filter: "all", entityStatus: 'idle'}))
    },
    changeEntityStatusAC: (state, action: PayloadAction<{ entityStatus: RequestStatusType, todolistID: string }>) => {
      const index = state.findIndex(s => s.id === action.payload.todolistID)
      state[index].entityStatus = action.payload.entityStatus
    },
    clearTodolistsDataAC: () => {
      return []
    }
  }
})

export const todolistsReducer = slice.reducer


// actions
export const {
  changeTodolistTitleAC,
  changeFilterAC,
  removeTodolistAC,
  addTodolistAC,
  getTodolitsAC,
  changeEntityStatusAC,
  clearTodolistsDataAC,
} = slice.actions

// thunks

export const getTodolistsTC = (): ThunkType => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistApi.getTodos()
    .then((res) => {
      dispatch(getTodolitsAC({todolists: res.data}))
      dispatch(setAppStatusAC({status: 'succeeded'}))
      return res.data
    })
    .then((tl) => {
      tl.forEach(tl => {

        dispatch(getTasksTC(tl.id))
      })
    }).catch((error: AxiosError) => {
    handleServerNetworkError(error.message, dispatch)
  })
}

export const deleteTodolistTC = (todolistID: string): ThunkType => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  dispatch(changeEntityStatusAC({entityStatus: 'loading', todolistID}))
  todolistApi.deleteTodo(todolistID)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(removeTodolistAC({todolistID}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
      } else {
        handlerServerError(res.data, dispatch)
      }
    })
    .catch((error: AxiosError) => {
      handleServerNetworkError(error.message, dispatch)
    })
}

export const createTodolistTC = (title: string): ThunkType => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistApi.createTodo(title)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(addTodolistAC({todolist: res.data.data.item}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
      } else {
        handlerServerError<{ item: TodolistType }>(res.data, dispatch)
      }
    })
    .catch((error: AxiosError) => {
      handleServerNetworkError(error.message, dispatch)
    })
}

export const changeTodolistTitleTC = (todolistID: string, title: string): ThunkType => dispatch => {
  dispatch(setAppStatusAC({status: 'loading'}))
  todolistApi.updateTodoTitle(title, todolistID)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(changeTodolistTitleAC({todolistID, title}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
      } else {
        handlerServerError(res.data, dispatch)
      }
    })
    .catch((error: AxiosError) => {
      handleServerNetworkError(error.message, dispatch)
    })

}

// types


export type getTodolitsACType = ReturnType<typeof getTodolitsAC>
export type addTodolistACType = ReturnType<typeof addTodolistAC>
export type removeTodolistACType = ReturnType<typeof removeTodolistAC>
export type clearTodolistsDataACType = ReturnType<typeof clearTodolistsDataAC>


export type FilterValueType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValueType
  entityStatus: RequestStatusType
}
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FilterValueType, RequestStatusType, TodolistDomainType} from '../../types';
import {changeTodolistTitle, addTodolist, removeTodolist, getTodolists} from './actions/TodolistActions';


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




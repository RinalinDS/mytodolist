import {clearTodolistsData} from "./TodolistsReducer";
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RequestStatusType, TasksType} from '../../types';
import {addTodolist, removeTodolist, getTodolists} from './actions/TodolistActions';
import {addTask, getTasks, removeTask, updateTask} from './actions/TaskActions';


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






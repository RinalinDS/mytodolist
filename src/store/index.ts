import {asyncActions as authActions} from './reducers/authReducer'
import {asyncActions as todolistAsyncActions, slice as todolistSlice} from './reducers/TodolistsReducer'
import {asyncActions as taskAsyncActions, slice as taskSlice} from './reducers/TasksReducer'


const todolistsActions = {
  ...todolistAsyncActions,
  ...todolistSlice.actions,
}

const taskActions = {
  ...taskAsyncActions,
  ...taskSlice.actions,

}


export {
  authActions,
  todolistsActions,
  taskActions
}
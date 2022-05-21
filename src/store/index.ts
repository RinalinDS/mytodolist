import {asyncActions as appActions} from './reducers/AppReducer'
import {asyncActions as authActions} from './reducers/authReducer'
import {asyncActions as todolistAsyncActions, slice} from './reducers/TodolistsReducer'
import {asyncActions as taskActions} from './reducers/TasksReducer'


const todolistsActions = {
  ...todolistAsyncActions,
  ...slice.actions
}


export {
  appActions,
  authActions,
  todolistsActions,
  taskActions
}
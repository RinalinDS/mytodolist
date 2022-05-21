import * as appActions from './AppActions'
import * as authActions from './AuthActions'
import * as todolistAsyncActions from './TodolistActions'
import * as taskActions from './TaskActions'
import {slice} from '../TodolistsReducer'


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
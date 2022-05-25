import {asyncActions, slice} from './authReducer'

const authActions = {
  ...asyncActions,
  ...slice.actions
}

const authReducer = slice.reducer


export {
  authActions,
  authReducer,
}
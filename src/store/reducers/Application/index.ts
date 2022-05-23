import {asyncActions, slice} from './AppReducer'

const appActions = {
  ...asyncActions,
  ...slice.actions
}



const {} = slice.actions

const appReducer = slice.reducer


export {
  appActions,
  appReducer,
}
import {asyncActions , slice} from './TasksReducer'


const tasksReducer = slice.reducer


const tasksActions = {
  ...asyncActions,
  ...slice.actions,
}


export {
  tasksActions,
  tasksReducer,
}
import {AppRootStateType} from '../../../../app/store';


export const selectTask = (state: AppRootStateType, todolistID: string, taskID: string ) => state.tasks[todolistID].filter(f => f.id === taskID)[0]
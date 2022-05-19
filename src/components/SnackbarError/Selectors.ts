import {AppRootStateType} from '../../app/store';


export const selectError = (state: AppRootStateType)  => state.app.error


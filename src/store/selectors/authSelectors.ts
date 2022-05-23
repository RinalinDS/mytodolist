import {AppRootStateType} from '../../types';


export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn
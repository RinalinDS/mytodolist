import {AppRootStateType} from '../store';

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn
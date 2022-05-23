import {ThunkAction} from 'redux-thunk';
import {AnyAction} from 'redux';
import {reducers, store} from '../store/store';


// Общая типизация для стейта приложения
export type AppRootStateType = ReturnType<typeof reducers>
//Все типы action-ов из редьюсеров. (всего приложения)


// по умолчанию если не указано ретурн тайп будет войд
export type ThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

// типизация диспатча, все как в документации :
export type AppDispatchType = typeof store.dispatch
// the default Dispatch type does not know about thunks or other middleware.
// In order to correctly dispatch thunks, you need to use the specific customized AppDispatch type
// from the store that includes the thunk middleware types, and use that with useDispatch.
// Adding a pre-typed useDispatch hook keeps you from forgetting to import AppDispatch where it's needed
// короче чтобы впитывал санки нормально? Санки мидлвейр обязательно через concat.

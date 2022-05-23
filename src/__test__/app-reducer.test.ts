import {NullableType, RequestStatusType} from "../types";
import {appReducer} from '../store/reducers/Application';
import {asyncActions, setAppError, setAppStatus} from "../store/reducers/Application/AppReducer";




type initialStateType = {
  status: RequestStatusType,
  error: NullableType<string>,
  isInitialized: boolean
}

let initialState: initialStateType;

beforeEach(() => {
  initialState = {
    status: 'idle',
    error: null as NullableType<string>,
    isInitialized: false
  }
})
// TODO суппорт, почему оно влияет на деструктуризацию ?!

test('correct error message should be set', () => {

  const endState = appReducer(initialState, setAppError({error: 'SOMETHING WRONG'}))

  expect(endState.error).toBe('SOMETHING WRONG');

});

test('correct status should be set', () => {

  const endState = appReducer(initialState, setAppStatus({status: 'loading'}))

  expect(endState.status).toBe('loading');

});

test('correct isInitialized value should be set', () => {

  const endState = appReducer(initialState, asyncActions.initializeApp.fulfilled('', '', undefined))

  expect(endState.isInitialized).toBeTruthy()

});



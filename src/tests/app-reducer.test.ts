import {
  appReducer,
  initializeAppTC,
  NullableType,
  RequestStatusType,
  setAppErrorAC,
  setAppStatusAC,
} from '../app/AppReducer';

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


test('correct error message should be set', () => {

  const endState = appReducer(initialState, setAppErrorAC({error: 'SOMETHING WRONG'}))

  expect(endState.error).toBe('SOMETHING WRONG');

});

test('correct status should be set', () => {

  const endState = appReducer(initialState, setAppStatusAC({status: 'loading'}))

  expect(endState.status).toBe('loading');

});

test('correct isInitialized value should be set', () => {

  const endState = appReducer(initialState, initializeAppTC.fulfilled({}, '', undefined))

  expect(endState.isInitialized).toBeTruthy()

});



import {tasksReducer} from "../store/reducers/Tasks/";
import { asyncActions,todolistsReducer} from "../store/reducers/Todolist/TodolistsReducer";
import {TasksType, TodolistDomainType} from '../types';


test('ids should be equals', () => {
  const startTasksState: TasksType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];


  const action = asyncActions.addTodolist.fulfilled({
    id: '3',
    title: "What to learn",
    addedDate: '',
    order: 0
  }, '', "What to learn");

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState);  // vozvrawaet massiv svoistv ob'ekta
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.id);
  expect(idFromTodolists).toBe(action.payload.id);
});




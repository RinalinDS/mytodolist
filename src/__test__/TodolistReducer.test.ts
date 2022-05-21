import {v1} from 'uuid';
import {
  addTodolist,
  changeFilter, changeTodolistTitle, getTodolists, removeTodolist,
  todolistsReducer,
} from "../store/reducers/TodolistsReducer";
import {FilterValueType, TodolistDomainType} from '../types';



let todolistId1: string;
let todolistId2: string;

let startState: Array<TodolistDomainType>;

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();
  startState = [
    {id: todolistId1, title: "What to learn", filter: "all", addedDate: '', order: 0, entityStatus: 'idle'},
    {id: todolistId2, title: "What to buy", filter: "all", addedDate: '', order: 0, entityStatus: 'idle'}
  ]
})


test('correct todolist should be removed', () => {

  const endState = todolistsReducer(startState, removeTodolist.fulfilled(todolistId1, '', todolistId1))

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

  let newTodolistTitle = "New Todolist";
  const endState = todolistsReducer(startState, addTodolist.fulfilled({
      id: '3',
      title: newTodolistTitle,
      order: 0,
      addedDate: ''
    },
    '', newTodolistTitle))

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodolistTitle);
});


test('correct todolist should change its name', () => {

  let newTodolistTitle = "New Todolist";
  const endState = todolistsReducer(startState, changeTodolistTitle.fulfilled({
    todolistID: todolistId2,
    title: newTodolistTitle
  }, 'requestId', {
    todolistID: todolistId2,
    title: newTodolistTitle
  }));

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodolistTitle);
});


test('correct filter of todolist should be changed', () => {

  let newFilter: FilterValueType = "completed";
  const endState = todolistsReducer(startState, changeFilter({filter: newFilter, todolistID: todolistId2}));

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe(newFilter);
});


test('todolists should be added', ()=> {
  const endState = todolistsReducer([], getTodolists.fulfilled ({todolists: startState}, 'requestID', ))
  expect(endState.length).toBe(2)
})
import {tasksReducer, TasksType} from "../features/TodolistList/TasksReducer";
import {addTodolistAC, TodolistDomainType, todolistsReducer} from "../features/TodolistList/TodolistsReducer";


test('ids should be equals', () => {
    const startTasksState: TasksType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];


    const action = addTodolistAC({todolist: {id: '3', title: "What to learn", addedDate: '', order: 0}});

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);  // vozvrawaet massiv svoistv ob'ekta
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});




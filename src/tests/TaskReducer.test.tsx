import {v1} from "uuid";
import {addTaskTC, getTasksTC, removeTaskTC, tasksReducer, updateTaskTC,} from "../features/TodolistList/TasksReducer";
import {TaskPriorities, TaskStatuses} from '../enums';
import {TasksType, TaskType} from '../types';


let todolistID1: string;
let todolistID2: string;

let tasks: TasksType;

beforeEach(() => {
  todolistID1 = 'todolistID1'
  todolistID2 = 'todolistID2'
  tasks = {
    [todolistID1]: [
      {
        id: v1(),
        title: "HTML",
        status: TaskStatuses.Completed,
        addedDate: '',
        deadline: '',
        description: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        todoListId: todolistID1,
        entityStatus: 'idle'
      },
      {
        id: v1(),
        title: "JS",
        status: TaskStatuses.Completed,
        addedDate: '',
        deadline: '',
        description: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        todoListId: todolistID1,
        entityStatus: 'idle'
      },
      {
        id: v1(),
        title: "React",
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        todoListId: todolistID1,
        entityStatus: 'idle'
      },
      {
        id: v1(),
        title: "Redux",
        status: TaskStatuses.New,
        addedDate: '',
        deadline: '',
        description: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        todoListId: todolistID1,
        entityStatus: 'idle',
      }
    ],
    [todolistID2]: [
      {
        id: v1(),
        title: "Lucky number of Slevin",
        status: TaskStatuses.Completed,
        addedDate: '',
        deadline: '',
        description: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        todoListId: todolistID2,
        entityStatus: 'idle',
      },
      {
        id: v1(),
        title: "Inception",
        addedDate: '',
        status: TaskStatuses.New,
        deadline: '',
        description: '',
        startDate: '',
        order: 0,
        priority: TaskPriorities.Low,
        todoListId: todolistID2,
        entityStatus: 'idle',
      },
    ]
  }
})

test("proper task should be removed", () => {

  const removeProperTask = tasksReducer(tasks, removeTaskTC.fulfilled({
    taskID: tasks[todolistID1][0].id,
    todolistID: todolistID1
  }, '', {taskID: tasks[todolistID1][0].id, todolistID: todolistID1}))

  expect(removeProperTask[todolistID1].length).toBe(3)
  expect(removeProperTask[todolistID2].length).toBe(2)
  expect(removeProperTask[todolistID1][1].title).toBe("React")


})


test("proper task should be added", () => {

  let newTaskTitle = "CSS"
  const task: TaskType = {
    id: '1',
    title: newTaskTitle,
    status: TaskStatuses.New,
    addedDate: '',
    startDate: '',
    order: 0,
    priority: TaskPriorities.Low,
    todoListId: todolistID1,
    deadline: ' ',
    description: '',
    entityStatus: 'idle'
  }
  const updatedTasks = tasksReducer(tasks, addTaskTC.fulfilled(task, '', {
    todolistID: task.todoListId,
    title: task.title
  }))
  console.log(updatedTasks)

  expect(updatedTasks[todolistID1].length).toBe(5)
  expect(updatedTasks[todolistID2].length).toBe(2)
  expect(updatedTasks[todolistID1][2].title).toBe("JS")
  expect(updatedTasks[todolistID1][0].title).toBe("CSS")
})


test("proper task should have new status", () => {
  const task: TaskType = {
    id: '1',
    title: 'DOES IT MATTER?',
    status: TaskStatuses.New,
    addedDate: '',
    startDate: '',
    order: 0,
    priority: TaskPriorities.Low,
    todoListId: todolistID1,
    deadline: ' ',
    description: '',
    entityStatus: 'idle'
  }
  const updatedTaskStatus = tasksReducer(tasks, updateTaskTC.fulfilled({
    todolistID: todolistID2,
    taskID: tasks[todolistID2][0].id,
    domainModel: {status: TaskStatuses.New}
  }, '', {task, domainModel: {status: TaskStatuses.New}}))

  expect(updatedTaskStatus[todolistID1].length).toBe(4)
  expect(updatedTaskStatus[todolistID2].length).toBe(2)
  expect(updatedTaskStatus[todolistID1][2].status).toBe(TaskStatuses.New)
  expect(updatedTaskStatus[todolistID2][0].status).toBe(TaskStatuses.New)
})

test("proper task should have new title", () => {
  const task: TaskType = {
    id: '1',
    title: 'DOES IT MATTER?',
    status: TaskStatuses.New,
    addedDate: '',
    startDate: '',
    order: 0,
    priority: TaskPriorities.Low,
    todoListId: todolistID1,
    deadline: ' ',
    description: '',
    entityStatus: 'idle'
  }

  let newTaskTitle = "Centurion"

  const updatedTaskTitle = tasksReducer(tasks, updateTaskTC.fulfilled({
    todolistID: todolistID2,
    taskID: tasks[todolistID2][0].id,
    domainModel: {title: newTaskTitle}
  }, '', {task, domainModel: {title: newTaskTitle}}))

  expect(updatedTaskTitle[todolistID1].length).toBe(4)
  expect(updatedTaskTitle[todolistID2].length).toBe(2)
  expect(updatedTaskTitle[todolistID1][2].status).toBe(TaskStatuses.New)
  expect(updatedTaskTitle[todolistID2][0].status).toBe(TaskStatuses.Completed)
  expect(updatedTaskTitle[todolistID2][0].title).toBe("Centurion")
  expect(updatedTaskTitle[todolistID2][1].title).toBe("Inception")
  expect(updatedTaskTitle[todolistID1][0].title).toBe("HTML")
})


test('task for todolist should be added', () => {

  const endState = tasksReducer({todolistID1: [], todolistID2: []}, getTasksTC.fulfilled({
    tasks: tasks[todolistID1],
    todolistID: todolistID1
  }, '', todolistID1))

  expect(endState[todolistID1].length).toBe(4)
  expect(endState[todolistID2].length).toBe(0)


})


import {v1} from "uuid";
import {addTaskAC, removeTaskAC, tasksReducer, TasksType, updateTaskAC} from "../features/TasksReducer";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";


let todolistID1: string;
let todolistID2: string;

let tasks: TasksType;

beforeEach(() => {
    todolistID1 = v1();
    todolistID2 = v1();
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
                todoListId: todolistID1
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
                todoListId: todolistID1
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
                todoListId: todolistID1
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
                todoListId: todolistID1
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
                todoListId: todolistID2
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
                todoListId: todolistID2
            },
        ]
    }
})

test("proper task should be removed", () => {

    const removeProperTask = tasksReducer(tasks, removeTaskAC(tasks[todolistID1][0].id, todolistID1))

    expect(removeProperTask[todolistID1].length).toBe(3)
    expect(removeProperTask[todolistID2].length).toBe(2)
    expect(removeProperTask[todolistID1][1].title).toBe("React")


})


test("proper task should be added", () => {

    let newTaskTitle = "CSS"
    const updatedTasks = tasksReducer(tasks, addTaskAC(
        {
            id: '1', title: newTaskTitle, status: TaskStatuses.New, addedDate: '', startDate: '', order: 0,
            priority: TaskPriorities.Low, todoListId: todolistID1, deadline: ' ', description: ''
        },
    ))

    expect(updatedTasks[todolistID1].length).toBe(5)
    expect(updatedTasks[todolistID2].length).toBe(2)
    expect(updatedTasks[todolistID1][2].title).toBe("JS")
    expect(updatedTasks[todolistID1][0].title).toBe("CSS")
})


test("proper task should have new status", () => {

    const updatedTaskStatus = tasksReducer(tasks, updateTaskAC(todolistID2, tasks[todolistID2][0].id, {status: TaskStatuses.New}))

    expect(updatedTaskStatus[todolistID1].length).toBe(4)
    expect(updatedTaskStatus[todolistID2].length).toBe(2)
    expect(updatedTaskStatus[todolistID1][2].status).toBe(TaskStatuses.New)
    expect(updatedTaskStatus[todolistID2][0].status).toBe(TaskStatuses.New)
})

test("proper task should have new title", () => {

    let newTaskTitle = "Centurion"

    const updatedTaskTitle = tasksReducer(tasks, updateTaskAC(todolistID2, tasks[todolistID2][0].id, {title: newTaskTitle}))

    expect(updatedTaskTitle[todolistID1].length).toBe(4)
    expect(updatedTaskTitle[todolistID2].length).toBe(2)
    expect(updatedTaskTitle[todolistID1][2].status).toBe(TaskStatuses.New)
    expect(updatedTaskTitle[todolistID2][0].status).toBe(TaskStatuses.Completed)
    expect(updatedTaskTitle[todolistID2][0].title).toBe("Centurion")
    expect(updatedTaskTitle[todolistID2][1].title).toBe("Inception")
    expect(updatedTaskTitle[todolistID1][0].title).toBe("HTML")
})





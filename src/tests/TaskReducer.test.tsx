import {v1} from "uuid";
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    tasksReducer
} from "../redux/TasksReducer";
import {TasksType} from "../AppWithRedux";

let todolistID1: string;
let todolistID2: string;

let tasks: TasksType;

beforeEach(() => {
    todolistID1 = v1();
    todolistID2 = v1();
    tasks = {
        [todolistID1]: [
            {id: v1(), title: "HTML", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "React", isDone: false},
            {id: v1(), title: "Redux", isDone: false}
        ],
        [todolistID2]: [
            {id: v1(), title: "Lucky number of Slevin", isDone: true},
            {id: v1(), title: "Inception", isDone: true},
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
    const updatedTasks = tasksReducer(tasks, addTaskAC(newTaskTitle, todolistID1))

    expect(updatedTasks[todolistID1].length).toBe(5)
    expect(updatedTasks[todolistID2].length).toBe(2)
    expect(updatedTasks[todolistID1][2].title).toBe("JS")
    expect(updatedTasks[todolistID1][0].title).toBe("CSS")
})


test("proper task should have new status", () => {

    const updatedTaskStatus = tasksReducer(tasks, changeTaskStatusAC(todolistID2, tasks[todolistID2][0].id, !tasks[todolistID2][0].isDone))

    expect(updatedTaskStatus[todolistID1].length).toBe(4)
    expect(updatedTaskStatus[todolistID2].length).toBe(2)
    expect(updatedTaskStatus[todolistID1][2].isDone).toBe(false)
    expect(updatedTaskStatus[todolistID2][0].isDone).toBe(false)
})

test("proper task should have new title", () => {

    let newTaskTitle = "Centurion"

    const updatedTaskTitle = tasksReducer(tasks, changeTaskTitleAC(todolistID2, tasks[todolistID2][0].id, newTaskTitle))

    expect(updatedTaskTitle[todolistID1].length).toBe(4)
    expect(updatedTaskTitle[todolistID2].length).toBe(2)
    expect(updatedTaskTitle[todolistID1][2].isDone).toBe(false)
    expect(updatedTaskTitle[todolistID2][0].isDone).toBe(true)
    expect(updatedTaskTitle[todolistID2][0].title).toBe("Centurion")
    expect(updatedTaskTitle[todolistID2][1].title).toBe("Inception")
    expect(updatedTaskTitle[todolistID1][0].title).toBe("HTML")
})





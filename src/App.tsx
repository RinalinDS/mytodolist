import React, {useReducer} from 'react';
import {v1} from 'uuid';
import './App.css';
import {Todolist} from "./components/Todolist";
import {AddItemForm} from "./components/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    TaskReducer
} from "./redux/TasksReducer";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    TodolistReducer
} from "./redux/TodolistsReducer";


export type TodolistType = {
    id: string
    title: string
    filter: FilterValueType
}
export type FilterValueType = "all" | "active" | "completed"

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

export type TasksType = {
    [key: string]: Array<TaskType>
}

function App() {


    let todolistID1 = v1();
    let todolistID2 = v1();


    let [todolists, todolistsDispatch] = useReducer(TodolistReducer, [
        {id: todolistID1, title: "What to learn", filter: "all"},
        {id: todolistID2, title: "What to watch", filter: "all"}
    ])

    let [tasks, tasksDispatch] = useReducer(TaskReducer, {
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
    });


    function addTask(title: string, todolistID: string) {
        tasksDispatch(addTaskAC(title, todolistID))
    }

    function removeTask(id: string, todolistID: string) {
        tasksDispatch(removeTaskAC(id, todolistID))
    }

    function changeTaskStatus(taskID: string, isDone: boolean, todolistID: string) {
        tasksDispatch(changeTaskStatusAC(todolistID, taskID, isDone))
    }

    function changeTaskTitle(todolistID: string, taskID: string, title: string) {
        tasksDispatch(changeTaskTitleAC(todolistID, taskID, title))
    }


    function changeTodolistTitle(todolistID: string, title: string) {
        todolistsDispatch(changeTodolistTitleAC(todolistID, title))
    }

    function changeFilter(value: FilterValueType, todolistID: string) {
        todolistsDispatch(changeFilterAC(value, todolistID))

    }


    function removeTodolist(todolistID: string) {
        const action = removeTodolistAC(todolistID)
        todolistsDispatch(action)
        tasksDispatch(action)

    }

    function addTodolist(title: string) {
        const action = addTodolistAC(title)
        todolistsDispatch(action)
        tasksDispatch(action)
    }


    return (
        <div className="App">

            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                    >
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>

            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm callBack={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolists.map(m => {
                        let tasksForTodolist = tasks[m.id];

                        if (m.filter === "active") {

                            tasksForTodolist = tasks[m.id].filter(t => !t.isDone);
                        }
                        if (m.filter === "completed") {
                            tasksForTodolist = tasks[m.id].filter(f => f.isDone);
                        }


                        return <Grid key={m.id} item>
                            <Paper style={{padding: "10px"}}>
                                <Todolist
                                    todolistID={m.id}
                                    title={m.title}
                                    tasks={tasksForTodolist}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeTaskStatus}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                    filter={m.filter}
                                    removeTodolist={removeTodolist}
                                />
                            </Paper>
                        </Grid>

                    })
                    }
                </Grid>
            </Container>
        </div>

    );
}


export default App;

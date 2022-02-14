import React, {useReducer} from 'react';
/*

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
    tasksReducer
} from "./redux/TasksReducer";
import {
    addTodolistAC,
    changeFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./redux/TodolistsReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./redux/store";


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

export function AppWithRedux() {

    const dispatch = useDispatch()
    const todolists = useSelector<AppRootStateType, Array<TodolistType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksType>(state => state.tasks)

    function addTask(title: string, todolistID: string) {
        dispatch(addTaskAC(title, todolistID))
    }

    function removeTask(id: string, todolistID: string) {
        dispatch(removeTaskAC(id, todolistID))
    }

    function changeTaskStatus(taskID: string, isDone: boolean, todolistID: string) {
        dispatch(changeTaskStatusAC(todolistID, taskID, isDone))
    }

    function changeTaskTitle(todolistID: string, taskID: string, title: string) {
        dispatch(changeTaskTitleAC(todolistID, taskID, title))
    }

    function changeTodolistTitle(todolistID: string, title: string) {
        dispatch(changeTodolistTitleAC(todolistID, title))
    }

    function changeFilter(value: FilterValueType, todolistID: string) {
        dispatch(changeFilterAC(value, todolistID))
    }


    function removeTodolist(todolistID: string) {
        dispatch(removeTodolistAC(todolistID))
    }

    function addTodolist(title: string) {
        dispatch(addTodolistAC(title))
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


*/

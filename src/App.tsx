import React, {useState} from 'react';
import {v1} from 'uuid';
import './App.css';
import {Todolist} from "./components/Todolist";
import {AddItemForm} from "./components/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";


type TodolistType = {
    id: string
    title: string
    filter: FilterValueType
}
export type FilterValueType = "all" | "active" | "completed"

function App() {


    let todolistID1 = v1();
    let todolistID2 = v1();


    let [todolists, setTodolists] = useState<Array<TodolistType>>([
        {id: todolistID1, title: "What to learn", filter: "all"},
        {id: todolistID2, title: "What to watch", filter: "all"}
    ])


    let [tasks, setTasks] = useState({
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
        debugger
        let newTask = {id: v1(), title, isDone: false}
        setTasks({...tasks, [todolistID]: [newTask, ...tasks[todolistID]]})

    }

    function removeTask(id: string, todolistID: string) {
        setTasks({...tasks, [todolistID]: tasks[todolistID].filter(f => f.id !== id)})
    }

    function changeFilter(value: FilterValueType, todolistID: string) {
        setTodolists(todolists.map(m => m.id === todolistID ? {...m, filter: value} : m))

    }

    function changeTaskStatus(taskID: string, isDone: boolean, todolistID: string) {
        setTasks({...tasks, [todolistID]: tasks[todolistID].map(m => m.id === taskID ? {...m, isDone} : m)})
    }

    function changeTaskTitle(todolistID: string, taskID: string, title: string) {
        setTasks({...tasks, [todolistID]: tasks[todolistID].map(m => m.id === taskID ? {...m, title} : m)})
    }

    function changeTodolistTitle(todolistID: string, title: string) {
        setTodolists(todolists.map(m => m.id === todolistID ? {...m, title} : m))
    }


    function removeTodolist(todolistID: string) {
        setTodolists(todolists.filter(f => f.id !== todolistID))
        delete tasks[todolistID]


    }

    function addTodolist(title: string) {
        let newID = v1()
        let newTodolist: TodolistType = {id: newID, title, filter: "all"}
        setTodolists([newTodolist, ...todolists])
        setTasks({...tasks, [newID]: []})
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
                    {todolists.map((m) => {
                        let tasksForTodolist = tasks[m.id];
                        if (m.filter === "active") {

                            tasks[m.id].filter(t => !t.isDone);
                        }
                        if (m.filter === "completed") {
                            tasksForTodolist = tasks[m.id].filter(t => t.isDone);
                        }


                        return <Grid item>
                            <Paper style={{padding: "10px"}}>
                            <Todolist
                                todolistID={m.id}
                                key={m.id}
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

import React from "react";
import {TaskMap} from "./TaskMap";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from '@material-ui/icons';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../redux/store";
import {TaskType, TodolistType} from "../AppWithRedux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../redux/TasksReducer";
import {changeFilterAC, changeTodolistTitleAC, removeTodolistAC} from "../redux/TodolistsReducer";


type PropsType = {
    todolistID: string
}

export function Todolist(props: PropsType) {
    debugger
    const dispatch = useDispatch()
    const tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[props.todolistID])
    const todolist = useSelector<AppRootStateType, TodolistType>(state => state.todolists.filter(f => props.todolistID === f.id)[0])

    const onAllClickHandler = () => dispatch(changeFilterAC('all', props.todolistID))
    const onActiveClickHandler = () => dispatch(changeFilterAC('active', props.todolistID))
    const onCompletedClickHandler = () => dispatch(changeFilterAC('completed', props.todolistID))
    const removeTodolistHandler = () => dispatch(removeTodolistAC(props.todolistID))
    const addTaskHelper = (title: string) => dispatch(addTaskAC(title, props.todolistID))
    const changeTaskTitle = (title: string, tID: string) => dispatch(changeTaskTitleAC(props.todolistID, tID, title))
    const changeTodolistTitle = (title: string) => dispatch(changeTodolistTitleAC(props.todolistID, title))

    function removeTask(id: string, todolistID: string) {
        dispatch(removeTaskAC(id, todolistID))
    }

    function changeTaskStatus(taskID: string, isDone: boolean, todolistID: string) {
        dispatch(changeTaskStatusAC(todolistID, taskID, isDone))
    }


    let tasksForTodolist = tasks
    if (todolist.filter === "active") {
        tasksForTodolist = tasks.filter(t => !t.isDone);
    }
    if (todolist.filter === "completed") {
        tasksForTodolist = tasks.filter(f => f.isDone);
    }
    return (

        <div>
            <h3><EditableSpan title={todolist.title} onChange={(title) => changeTodolistTitle(title)}/>
                <IconButton aria-label="delete" onClick={removeTodolistHandler}>
                    <Delete/>
                </IconButton>

            </h3>
            <AddItemForm callBack={(title) => addTaskHelper(title)}/>
            {tasksForTodolist.map(m => {
                return (
                    <div key={m.id} className={m.isDone ? "is-done" : ""}>
                        <Checkbox
                            color='primary'
                            onChange={(e) => changeTaskStatus(m.id, e.currentTarget.checked, props.todolistID)}
                            checked={m.isDone}/>
                        <EditableSpan title={m.title} onChange={(title) => changeTaskTitle(title, m.id)}/>

                        <IconButton aria-label="delete" onClick={() => removeTask(m.id, props.todolistID)}>
                            <Delete/>
                        </IconButton>
                    </div>
                        )})}

                        {/*        <TaskMap
                tasks={tasksForTodolist}
                removeTask={removeTask}
                todolistID={props.todolistID}
                changeTaskStatus={changeTaskStatus}
                changeTaskTitle ={changeTaskTitle}
            />
*/}
                        <div>
                            <Button variant={todolist.filter === "all" ? "outlined" : "text"}
                                    onClick={onAllClickHandler}>All
                            </Button>
                            <Button variant={todolist.filter === "active" ? "outlined" : "text"}
                                    onClick={onActiveClickHandler} color="secondary">Active
                            </Button>
                            <Button variant={todolist.filter === "completed" ? "outlined" : "text"}
                                    onClick={onCompletedClickHandler} color="primary">Completed
                            </Button>
                        </div>

                    </div>
                )
            }


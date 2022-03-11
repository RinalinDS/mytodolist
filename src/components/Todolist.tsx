import React, {memo, useCallback} from "react";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from '@material-ui/icons';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../redux/store";

import {addTaskAC} from "../redux/TasksReducer";
import {
    changeFilterAC,
    changeTodolistTitleAC,
    FilterValueType,
    removeTodolistAC,
    TodolistDomainType
} from "../redux/TodolistsReducer";
import {Task1} from "./Task1";
import {TaskStatuses, TaskType} from "../api/todolist-api";


type PropsType = {
    todolistID: string
}

export const Todolist = memo((props: PropsType) => {
    console.log('Todolist')

    const dispatch = useDispatch()
    const tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[props.todolistID])
    const todolist = useSelector<AppRootStateType, TodolistDomainType>(state => state.todolists.filter(f => props.todolistID === f.id)[0])


    const changeFilter = useCallback((filter: FilterValueType) => {
        dispatch(changeFilterAC(filter, props.todolistID))
    }, [dispatch, props.todolistID])


    const removeTodolistHandler = useCallback(() => dispatch(removeTodolistAC(props.todolistID)), [dispatch, props.todolistID])

    const addTaskHelper = useCallback((title: string) => dispatch(addTaskAC(title, props.todolistID)), [dispatch, props.todolistID])

    const changeTodolistTitle = useCallback((title: string) => dispatch(changeTodolistTitleAC(props.todolistID, title)), [dispatch, props.todolistID])

    /* const changeTaskTitle = useCallback( (title: string, tID: string) =>
        dispatch(changeTaskTitleAC(props.todolistID, tID, title)), [dispatch, props.todolistID] )*/

    /* const removeTask = useCallback((id: string, todolistID: string) => {
         dispatch(removeTaskAC(id, todolistID))
     } , [dispatch, props.todolistID])*/

    /*   const changeTaskStatus = useCallback( (taskID: string, isDone: boolean, todolistID: string) => {
           dispatch(changeTaskStatusAC(todolistID, taskID, isDone))
       }, [dispatch, props.todolistID])*/


    let tasksForTodolist = tasks
    if (todolist.filter === "active") {
        tasksForTodolist = tasks.filter(f => f.status === TaskStatuses.New);
    }
    if (todolist.filter === "completed") {
        tasksForTodolist = tasks.filter(f => f.status === TaskStatuses.Completed);
    }
    return (

        <div>
            <h3><EditableSpan title={todolist.title} onChange={changeTodolistTitle}/>
                <IconButton aria-label="delete" onClick={removeTodolistHandler}>
                    <Delete/>
                </IconButton>

            </h3>
            <AddItemForm callBack={addTaskHelper}/>
            {/* {tasksForTodolist.map(m => <Task todolistID={props.todolistID}
            changeTaskStatus={changeTaskStatus} changeTaskTitle={changeTaskTitle} removeTask={removeTask} task={m}/>
            )}*/}
            {tasksForTodolist.map(m => <Task1
                key={m.id} todolistID={props.todolistID}
                taskID={m.id}/>
            )}

            <div>
                <Button variant={todolist.filter === "all" ? "outlined" : "text"}
                        onClick={() => changeFilter('all')}>All
                </Button>
                <Button variant={todolist.filter === "active" ? "outlined" : "text"}
                        onClick={() => changeFilter('active')} color="secondary">Active
                </Button>
                <Button variant={todolist.filter === "completed" ? "outlined" : "text"}
                        onClick={() => changeFilter('completed')} color="primary">Completed
                </Button>
            </div>

        </div>
    )
})

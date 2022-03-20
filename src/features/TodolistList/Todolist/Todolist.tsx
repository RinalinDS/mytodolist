import React, {memo, useCallback, useEffect} from "react";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../../app/store";

import {addTaskTC, getTasksTC} from "../TasksReducer";
import {
    changeFilterAC,
    changeTodolistTitleTC,
    deleteTodolistTC,
    FilterValueType,
    TodolistDomainType
} from "../TodolistsReducer";
import {Task} from "./ Task/Task";
import {TaskStatuses, TaskType} from "../../../api/todolist-api";
import {Delete} from "@mui/icons-material";


type PropsType = {
    todolistID: string
}

export const Todolist = memo((props: PropsType) => {

    useEffect(() => {
        dispatch(getTasksTC(props.todolistID))
    }, [])


    const dispatch = useDispatch()
    const tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[props.todolistID])
    const todolist = useSelector<AppRootStateType, TodolistDomainType>(state => state.todolists.filter(f => props.todolistID === f.id)[0])


    const changeFilter = useCallback((filter: FilterValueType) => {
        dispatch(changeFilterAC(filter, props.todolistID))
    }, [dispatch, props.todolistID])


    const removeTodolistHandler = useCallback(() => dispatch(deleteTodolistTC(props.todolistID)), [dispatch, props.todolistID])

    const addTaskHelper = useCallback((title: string) => dispatch(addTaskTC(props.todolistID, title)), [dispatch, props.todolistID])

    const changeTodolistTitle = useCallback((title: string) => dispatch(changeTodolistTitleTC(props.todolistID, title)), [dispatch, props.todolistID])


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
                <IconButton disabled={todolist.entityStatus === 'loading'} aria-label="delete"
                            onClick={removeTodolistHandler}>
                    <Delete/>
                </IconButton>

            </h3>
            <AddItemForm callBack={addTaskHelper} disabled={todolist.entityStatus === 'loading'}/>

            {tasksForTodolist.map(m => <Task
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

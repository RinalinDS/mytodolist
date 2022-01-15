import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValueType} from "../App";
import {TaskMap} from "./TaskMap";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolistID: string
    title: string
    tasks: Array<TaskType>
    removeTask: (id: string, todolistID: string) => void
    changeFilter: (value: FilterValueType, todolistID: string) => void
    addTask: (title: string, todolistID: string) => void
    changeTaskStatus: (taskID: string, isDone: boolean, todolistID: string) => void
    filter: FilterValueType
    removeTodolist: (todolistID: string) => void
    changeTaskTitle : (title: string, tID:string, todolistID: string) => void
    changeTodolistTitle : ( todolistID: string, title: string) => void

}

export function Todolist(props: PropsType) {


    const onAllClickHanlder = () => props.changeFilter("all", props.todolistID)
    const onActiveClickHanlder = () => props.changeFilter("active", props.todolistID)
    const onCompletedClickHanlder = () => props.changeFilter("completed", props.todolistID)
    const removeTodolistHandler = () => props.removeTodolist(props.todolistID)
    const addTaskHelper = (title: string) =>  {
    props.addTask(title, props.todolistID)
    }
    const changeTaskTitle = (title: string, tID: string) => props.changeTaskTitle(props.todolistID,tID, title)
    const changeTodolistTitle =(title: string) => props.changeTodolistTitle(props.todolistID, title)
    return (

        <div>
            <h3><EditableSpan title={props.title} onChange={(title) => changeTodolistTitle(title)}/>
                <button onClick={removeTodolistHandler}>x</button>
            </h3>
            <AddItemForm callBack={(title) => addTaskHelper(title)}/>

            <TaskMap
                tasks={props.tasks}
                removeTask={props.removeTask}
                todolistID={props.todolistID}
                changeTaskStatus={props.changeTaskStatus}
                changeTaskTitle = {(title, tID)=> changeTaskTitle(title, tID)}
            />

            <div>
                <button className={props.filter === "all" ? "active-filter" : ""} onClick={onAllClickHanlder}>All
                </button>
                <button className={props.filter === "active" ? "active-filter" : ""}
                        onClick={onActiveClickHanlder}>Active
                </button>
                <button className={props.filter === "completed" ? "active-filter" : ""}
                        onClick={onCompletedClickHanlder}>Completed
                </button>
            </div>

        </div>
    )
}


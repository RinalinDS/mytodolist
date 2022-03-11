import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../redux/TasksReducer";
import {AppRootStateType} from "../redux/store";
import {TaskStatuses, TaskType} from "../api/todolist-api";


export type TaskPropsType = {
    taskID: string
    todolistID: string
}

export const Task1 = React.memo((props: TaskPropsType) => {

    console.log('task1')


    const task = useSelector<AppRootStateType, TaskType>(state => state.tasks[props.todolistID].filter(f => f.id === props.taskID)[0])
    const dispatch = useDispatch()

    const removeTask = useCallback( () =>  dispatch(removeTaskAC(task.id, props.todolistID)), [task.id, props.todolistID, dispatch])


    const changeTaskStatus = useCallback( (e: ChangeEvent<HTMLInputElement>) => {
        let newStatusValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(changeTaskStatusAC(props.todolistID, task.id, newStatusValue))
    }, [task.id, props.todolistID, dispatch])

    const changeTaskTitle = useCallback( (newValue: string) =>
        dispatch(changeTaskTitleAC(props.todolistID, task.id, newValue )), [props.todolistID, task.id, dispatch])


    return (
        <div key={task.id} className={task.status=== TaskStatuses.Completed ? "is-done" : ""}>
    <Checkbox
        checked={task.status === TaskStatuses.Completed}
    color="primary"
    onChange={changeTaskStatus}
    />

    <EditableSpan title={task.title} onChange={changeTaskTitle}/>
    <IconButton onClick={removeTask}>
        <Delete/>
        </IconButton>
        </div>
);
})


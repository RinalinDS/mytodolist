import React, {ChangeEvent, memo, useCallback} from "react";
import {TaskType} from "../App";
import {EditableSpan} from "./EditableSpan";
import {Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";

type TaskPropsType = {
    task: TaskType
    removeTask: (id: string, todolistID: string) => void
    todolistID: string
    changeTaskStatus: (taskID: string, isDone: boolean, todolistID: string) => void
    changeTaskTitle: (title: string, tID: string) => void
}

export const Task = memo(({
                              task,
                              removeTask,
                              todolistID,
                              changeTaskStatus,
                              changeTaskTitle,
                              ...props
                          }: TaskPropsType) => {
    console.log('task')

    const removeTaskHandler = useCallback(() => removeTask(task.id, todolistID), [task.id, todolistID])
    const changeTaskStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => changeTaskStatus(task.id, e.currentTarget.checked, todolistID), [task.id, todolistID])
    const ChangeTaskTitle = useCallback((title: string) => changeTaskTitle(title, task.id), [task.id])
    return (
        <div key={task.id} className={task.isDone ? "is-done" : ""}>
            <Checkbox
                color='primary'
                onChange={changeTaskStatusHandler}
                checked={task.isDone}/>
            <EditableSpan title={task.title} onChange={ChangeTaskTitle}/>

            <IconButton aria-label="delete" onClick={removeTaskHandler}>
                <Delete/>
            </IconButton>
        </div>

    )

})


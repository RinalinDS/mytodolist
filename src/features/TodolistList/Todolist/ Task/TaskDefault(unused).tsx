import React, {ChangeEvent, memo, useCallback} from "react";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@mui/icons-material";
import {IconButton} from "@material-ui/core";
import {Checkbox} from "@mui/material";
import {TaskType} from '../../../../types';
import {TaskStatuses} from '../../../../enums';

type TaskPropsType = {
    task: TaskType
    removeTask: (id: string, todolistID: string) => void
    todolistID: string
    changeTaskStatus: (taskID: string, isDone: boolean, todolistID: string) => void
    changeTaskTitle: (title: string, tID: string) => void
}

export const TaskDefaultUnused = memo(({
                                           task,
                                           removeTask,
                                           todolistID,
                                           changeTaskStatus,
                                           changeTaskTitle,
                                       }: TaskPropsType) => {


    const removeTaskHandler = useCallback(() => removeTask(task.id, todolistID), [task.id, todolistID])
    const changeTaskStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => changeTaskStatus(task.id, e.currentTarget.checked, todolistID), [task.id, todolistID])
    const ChangeTaskTitle = useCallback((title: string) => changeTaskTitle(title, task.id), [task.id])
    return (
        <div key={task.id} className={task.status ? "is-done" : ""}>
            <Checkbox
                color='primary'
                onChange={changeTaskStatusHandler}
                checked={task.status === TaskStatuses.Completed}/>
            <EditableSpan title={task.title} onChange={ChangeTaskTitle}/>

            <IconButton aria-label="delete" onClick={removeTaskHandler}>
                <Delete/>
            </IconButton>
        </div>

    )

})


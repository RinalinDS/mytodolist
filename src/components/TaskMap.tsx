import React, {ChangeEvent} from "react";
import {TaskType} from "./../AppWithRedux";
import {EditableSpan} from "./EditableSpan";
import {Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";

type TaskMapPropsType = {
    tasks: Array<TaskType>
    removeTask: (id: string, todolistID: string) => void
    todolistID: string
    changeTaskStatus: (taskID: string, isDone: boolean, todolistID: string) => void
    changeTaskTitle : (title: string, tID: string) => void
}

export function TaskMap({tasks, removeTask, todolistID, changeTaskStatus, changeTaskTitle, ...props}: TaskMapPropsType) {
    const removeTaskHandler = (id: string) => removeTask(id, todolistID)
    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>, taskId: string) => changeTaskStatus(taskId, e.currentTarget.checked, todolistID)
    const ChangeTaskTitle = (title: string, tID: string) => changeTaskTitle(title, tID)
    return (
        <div>
            {tasks.map(m => {
                return (
                    <div key={m.id} className={m.isDone ? "is-done" : ""}>
                        <Checkbox
                            color='primary'
                            onChange={(e) => changeTaskStatusHandler(e, m.id)}
                            checked={m.isDone}/>
                        <EditableSpan title={m.title} onChange={(title) => ChangeTaskTitle(title, m.id)}/>

                        <IconButton aria-label="delete" onClick={() => removeTaskHandler(m.id)}>
                            <Delete />
                        </IconButton>

                    </div>
                )

            })
            }

        </div>

    )

}


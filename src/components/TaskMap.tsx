import React, {ChangeEvent} from "react";
import {TaskType} from "./Todolist";
import {EditableSpan} from "./EditableSpan";

type TaskMapPropsType = {
    tasks: Array<TaskType>
    removeTask: (id: string, todolistID: string) => void
    todolistID: string
    changeTaskStatus: (taskID: string, isDone: boolean, todolistID: string) => void
    changeTaskTitle : (title: string, tID: string) => void
}

export function TaskMap({tasks, removeTask, todolistID, changeTaskStatus, ...props}: TaskMapPropsType) {
    const removeTaskHandler = (id: string) => removeTask(id, todolistID)
    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>, taskId: string) => changeTaskStatus(taskId, e.currentTarget.checked, todolistID)
    const ChangeTaskTitle = (title: string, tID: string) => props.changeTaskTitle(title, tID)
    return (
        <ul>
            {tasks.map(m => {
                return (
                    <li key={m.id} className={m.isDone ? "is-done" : ""}>
                        <input
                            type="checkbox"
                            onChange={(e) => changeTaskStatusHandler(e, m.id)}
                            checked={m.isDone}/>
                        <EditableSpan title={m.title} onChange={(title) => ChangeTaskTitle(title, m.id)}/>
                        <button onClick={() => removeTaskHandler(m.id)}>x</button>

                    </li>
                )

            })
            }

        </ul>

    )

}


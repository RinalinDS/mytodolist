import React, {ChangeEvent, useCallback} from 'react';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import {Delete} from "@mui/icons-material/";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {useDispatch, useSelector} from "react-redux";
import {removeTaskTC, updateTaskTC} from "../../TasksReducer";
import {AppRootStateType} from "../../../../app/store";
import {TaskStatuses} from '../../../../enums'
import {TaskType} from '../../../../types';


type TaskPropsType = {
  taskID: string
  todolistID: string
}

export const Task = React.memo((props: TaskPropsType) => {


  const task = useSelector<AppRootStateType, TaskType>(state => state.tasks[props.todolistID].filter(f => f.id === props.taskID)[0])
  const dispatch = useDispatch()

  const removeTask = useCallback(() => dispatch(removeTaskTC({
    todolistID: props.todolistID,
    taskID: props.taskID
  })), [task.id, props.todolistID, dispatch])


  const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    dispatch(updateTaskTC(task, {status}))
  }, [task.id, props.todolistID, dispatch])

  const changeTaskTitle = useCallback((title: string) =>
    dispatch(updateTaskTC(task, {title})), [task, dispatch])


  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox
        checked={task.status === TaskStatuses.Completed}
        color="primary"
        onChange={changeTaskStatus}
        disabled={task.entityStatus === 'loading'}
      />

      <EditableSpan title={task.title} onChange={changeTaskTitle} disabled={task.entityStatus === 'loading'}/>
      <IconButton onClick={removeTask} disabled={task.entityStatus === 'loading'}>
        <Delete/>
      </IconButton>
    </div>
  );
})


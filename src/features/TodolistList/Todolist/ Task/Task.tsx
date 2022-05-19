import React, {ChangeEvent, FC, useCallback} from 'react';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import {Delete} from "@mui/icons-material/";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {removeTaskTC, updateTaskTC} from "../../TasksReducer";
import {TaskStatuses} from '../../../../enums'
import {TaskType} from '../../../../types';
import {useAppDispatch, useAppSelector} from '../../../../app/store';


type TaskPropsType = {
  taskID: string
  todolistID: string
}

export const Task: FC<TaskPropsType> = React.memo(({taskID, todolistID}) => { 

 const task = useAppSelector<TaskType>(state => state.tasks[todolistID].filter(f => f.id === taskID)[0])
 const dispatch = useAppDispatch()

  const removeTask = useCallback(() => dispatch(removeTaskTC({
    todolistID,
    taskID
  })), [task.id, todolistID, dispatch])

  const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    dispatch(updateTaskTC({task, domainModel: {status}}))
  }, [task.id, todolistID, dispatch])

  const changeTaskTitle = useCallback((title: string) =>
    dispatch(updateTaskTC({task, domainModel: {title}})), [task, dispatch])


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


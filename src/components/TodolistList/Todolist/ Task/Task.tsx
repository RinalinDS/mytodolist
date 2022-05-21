import React, {ChangeEvent, FC, useCallback} from 'react';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import {Delete} from "@mui/icons-material/";
import {EditableSpan} from "../../../common/EditableSpan/EditableSpan";
import {TaskStatuses} from '../../../../enums'
import {TaskType} from '../../../../types';
import {useActions, useAppSelector} from '../../../../store/store';
import {taskActions} from '../../../../store/reducers/actions';


type TaskPropsType = {
  taskID: string
  todolistID: string
}

export const Task: FC<TaskPropsType> = React.memo(({taskID, todolistID}) => {

  const task = useAppSelector<TaskType>(state => state.tasks[todolistID].filter(f => f.id === taskID)[0])

  const {updateTask, removeTask} = useActions(taskActions)

  const removeTaskHandler = useCallback(() =>
    removeTask({todolistID, taskID}), [taskID, todolistID])

  const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    updateTask({task, domainModel: {status}})
  }, [task.id, todolistID, task, updateTask])

  const changeTaskTitle = useCallback((title: string) =>
    updateTask({task, domainModel: {title}}), [task])

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox
        checked={task.status === TaskStatuses.Completed}
        color="primary"
        onChange={changeTaskStatus}
        disabled={task.entityStatus === 'loading'}
      />
      <EditableSpan title={task.title} onChange={changeTaskTitle} disabled={task.entityStatus === 'loading'}/>
      <IconButton onClick={removeTaskHandler} disabled={task.entityStatus === 'loading'}>
        <Delete/>
      </IconButton>
    </div>
  );
})


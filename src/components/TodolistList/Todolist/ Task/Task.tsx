import React, {ChangeEvent, FC, useCallback} from 'react';
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import {Delete} from "@mui/icons-material/";
import {EditableSpan} from "../../../common/EditableSpan/EditableSpan";
import {TaskStatus} from '../../../../enums'
import {TaskType} from '../../../../types';
import {useActions, useAppSelector} from '../../../../hooks/storeHooks';
import {tasksActions} from '../../../../store/reducers/Tasks';


type TaskPropsType = {
  taskID: string
  todolistID: string
}

export const Task: FC<TaskPropsType> = React.memo(({taskID, todolistID}) => {

  const task = useAppSelector<TaskType>(state => state.tasks[todolistID].filter(f => f.id === taskID)[0])

  const {updateTask, removeTask} = useActions(tasksActions)

  const removeTaskHandler = useCallback(() => removeTask({todolistID, taskID}), [taskID, todolistID])

  const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    updateTask({task, domainModel: {status: e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New}})
  }, [task])

  const changeTaskTitle = useCallback((title: string) =>
    updateTask({task, domainModel: {title}}), [task])

  const isTaskDisabled = task.entityStatus === 'loading'
  const isTaskCompleted =  task.status === TaskStatus.Completed

  return (
    <div key={task.id} className={isTaskCompleted ? "is-done" : ""} style={{position: 'relative'}}>
      <Checkbox
        checked={isTaskCompleted}
        color="primary"
        onChange={changeTaskStatus}
        disabled={isTaskDisabled}
      />
      <EditableSpan title={task.title} onChange={changeTaskTitle} disabled={isTaskDisabled}/>
      <IconButton size={'small'} onClick={removeTaskHandler} disabled={isTaskDisabled} style={{position: 'absolute', right: '2px', top: '2px'}}>
        <Delete fontSize={'small'}/>
      </IconButton>
    </div>
  );
})


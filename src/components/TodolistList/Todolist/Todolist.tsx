import React, {FC, memo, useCallback} from "react";
import {AddItemForm} from "../../common/AddItemForm/AddItemForm";
import {EditableSpan} from "../../common/EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {useAppDispatch, useAppSelector} from "../../../store/store";
import {addTaskTC} from "../../../store/reducers/TasksReducer";
import {changeFilterAC, changeTodolistTitleTC, deleteTodolistTC,} from "../../../store/reducers/TodolistsReducer";
import {Task} from "./ Task/Task";
import {Delete} from "@mui/icons-material";
import {TaskStatuses} from '../../../enums';
import {FilterValueType, TaskType, TodolistDomainType} from '../../../types';


type TodolistPropsType = {
  todolistID: string
}

export const Todolist: FC<TodolistPropsType> = memo(({todolistID}) => {

  const dispatch = useAppDispatch()
  const tasks = useAppSelector<Array<TaskType>>(state => state.tasks[todolistID])
  const todolist = useAppSelector<TodolistDomainType>(state => state.todolists.filter(f => todolistID === f.id)[0])

  const changeFilter = useCallback((filter: FilterValueType) => {
    dispatch(changeFilterAC({filter, todolistID: todolistID}))
  }, [dispatch, todolistID])

  const removeTodolistHandler = useCallback(() => dispatch(deleteTodolistTC(todolistID)), [dispatch, todolistID])

  const addTaskHelper = useCallback((title: string) => dispatch(addTaskTC({
    todolistID,
    title
  })), [dispatch, todolistID])

  const changeTodolistTitle = useCallback((title: string) => dispatch(changeTodolistTitleTC({
    todolistID,
    title
  })), [dispatch, todolistID])

  let tasksForTodolist = tasks
  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter(f => f.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter(f => f.status === TaskStatuses.Completed);
  }
  return (

    <div>
      <h3><EditableSpan title={todolist.title} onChange={changeTodolistTitle}/>
        <IconButton disabled={todolist.entityStatus === 'loading'} aria-label="delete"
                    onClick={removeTodolistHandler}>
          <Delete/>
        </IconButton>

      </h3>
      <AddItemForm callBack={addTaskHelper} disabled={todolist.entityStatus === 'loading'}/>

      {tasksForTodolist.map(m => <Task
        key={m.id} todolistID={todolistID}
        taskID={m.id}/>
      )}

      <div>
        <Button variant={todolist.filter === "all" ? "outlined" : "text"}
                onClick={() => changeFilter('all')}>All
        </Button>
        <Button variant={todolist.filter === "active" ? "outlined" : "text"}
                onClick={() => changeFilter('active')} color="secondary">Active
        </Button>
        <Button variant={todolist.filter === "completed" ? "outlined" : "text"}
                onClick={() => changeFilter('completed')} color="primary">Completed
        </Button>
      </div>

    </div>
  )
})

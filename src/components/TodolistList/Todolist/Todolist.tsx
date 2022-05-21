import React, {FC, memo, useCallback} from "react";
import {AddItemForm} from "../../common/AddItemForm/AddItemForm";
import {EditableSpan} from "../../common/EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {useActions, useAppDispatch, useAppSelector} from "../../../store/store";
import {Task} from "./ Task/Task";
import {Delete} from "@mui/icons-material";
import {TaskStatuses} from '../../../enums';
import {FilterValueType, TaskType, TodolistDomainType} from '../../../types';
import {addTask} from '../../../store/reducers/actions/TaskActions';
import {taskActions, todolistsActions} from '../../../store/reducers/actions';


type TodolistPropsType = {
  todolistID: string
}

export const Todolist: FC<TodolistPropsType> = memo(({todolistID}) => {

  const dispatch = useAppDispatch()
  const tasks = useAppSelector<Array<TaskType>>(state => state.tasks[todolistID])
  const todolist = useAppSelector<TodolistDomainType>(state => state.todolists.filter(f => todolistID === f.id)[0])

  const {addTask} = useActions(taskActions)
  const {removeTodolist, changeTodolistTitle, changeFilter} = useActions(todolistsActions)

  const changeTodolistFilter = useCallback((filter: FilterValueType) => {
    changeFilter({filter, todolistID: todolistID})
  }, [todolistID])

  const deleteTodolistHandler = useCallback(() => removeTodolist(todolistID), [todolistID])
  // это все еще работает как dispatch(removeTodolistТС(todolistID)), но благодаря кастомному хуку useActions и тому, что я засунул внутрь
  // него в начале компоненты все экшны , которые относятся к таскам, он мне выдал колбэк,
  // с таким же именем уже обернутый диспатчем

  const changeTodolistTitleHandler = useCallback((title: string) =>
    changeTodolistTitle({todolistID, title}), [todolistID])
  // это все еще работает как dispatch(changeTodolistTitleТС(title: string)), но благодаря кастомному хуку useActions и тому, что я засунул внутрь
  // него в начале компоненты все экшны , которые относятся к таскам, он мне выдал колбэк,
  // с таким же именем уже обернутый диспатчем

  const addTaskHandler = useCallback((title: string) =>
    addTask({todolistID, title}), [dispatch, todolistID])
  // это все еще работает как dispatch(addTaskTC(title: string)), но благодаря кастомному хуку useActions и тому, что я засунул внутрь
  // него в начале компоненты все экшны , которые относятся к таскам, он мне выдал колбэк,
  // с таким же именем уже обернутый диспатчем

  let tasksForTodolist = tasks
  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter(f => f.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter(f => f.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <h3><EditableSpan title={todolist.title} onChange={changeTodolistTitleHandler}/>
        <IconButton disabled={todolist.entityStatus === 'loading'} aria-label="delete"
                    onClick={deleteTodolistHandler}>
          <Delete/>
        </IconButton>
      </h3>
      <AddItemForm callBack={addTaskHandler} disabled={todolist.entityStatus === 'loading'}/>

      {tasksForTodolist.map(m => <Task
        key={m.id} todolistID={todolistID}
        taskID={m.id} />
      )}

      <div>
        <Button variant={todolist.filter === "all" ? "outlined" : "text"}
                onClick={() => changeTodolistFilter('all')}>All
        </Button>
        <Button variant={todolist.filter === "active" ? "outlined" : "text"}
                onClick={() => changeTodolistFilter('active')} color="secondary">Active
        </Button>
        <Button variant={todolist.filter === "completed" ? "outlined" : "text"}
                onClick={() => changeTodolistFilter('completed')} color="primary">Completed
        </Button>
      </div>
    </div>
  )
})

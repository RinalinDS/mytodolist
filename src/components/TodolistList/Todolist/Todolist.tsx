import React, {FC, memo, useCallback} from "react";
import {AddItemForm, AddItemFormSubmitHelperType} from "../../common/AddItemForm/AddItemForm";
import {EditableSpan} from "../../common/EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {useActions, useAppDispatch, useAppSelector} from "../../../store/store";
import {Task} from "./ Task/Task";
import {Delete} from "@mui/icons-material";
import {TaskStatuses} from '../../../enums';
import {FilterValueType, TaskType, TodolistDomainType} from '../../../types';
import {taskActions, todolistsActions} from '../../../store';
import Paper from '@material-ui/core/Paper';


type TodolistPropsType = {
  todolistID: string
}

export const Todolist: FC<TodolistPropsType> = memo(({todolistID}) => {

  const dispatch = useAppDispatch()

  const tasks = useAppSelector<Array<TaskType>>(state => state.tasks[todolistID])
  const todolist = useAppSelector<TodolistDomainType>(state => state.todolists.filter(f => todolistID === f.id)[0])
  const {removeTodolist, changeTodolistTitle, changeFilter} = useActions(todolistsActions)

  const changeTodolistFilter = useCallback((filter: FilterValueType) => {
    changeFilter({filter, todolistID: todolistID})
  }, [todolistID])

  const addTasksCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
    let thunk = taskActions.addTask({title, todolistID})
    const resultAction = await dispatch(thunk)
    if (taskActions.addTask.rejected.match(resultAction)) {
      if (resultAction.payload?.errors?.length) {
        const errorMessage = resultAction.payload?.errors[0]
        helper.setError(errorMessage)
      } else {
        helper.setError('some error ocurred')
      }
    } else {
      helper.setTitle('')
    }
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

  // const addTaskHandler = useCallback((title: string) =>
  //   addTask({todolistID, title}), [todolistID])
  // // это все еще работает как dispatch(addTaskTC(title: string)), но благодаря кастомному хуку useActions и тому, что я засунул внутрь
  // // него в начале компоненты все экшны , которые относятся к таскам, он мне выдал колбэк,
  // // с таким же именем уже обернутый диспатчем

  let tasksForTodolist = tasks
  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter(f => f.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter(f => f.status === TaskStatuses.Completed);
  }
  const isTodoDisabled = todolist.entityStatus === 'loading'
  return (
    <Paper style={{position: 'relative', padding: '10px', backgroundColor: 'aliceblue'}}>
      <IconButton disabled={isTodoDisabled} aria-label="delete"
                  onClick={deleteTodolistHandler} style={{position: 'absolute', right: '13px', top: '20px'}}>
        <Delete/>
      </IconButton>
      <h3 style={{marginRight: '35px'}}><EditableSpan title={todolist.title} onChange={changeTodolistTitleHandler}/>

      </h3>
      <AddItemForm callBack={addTasksCallback} disabled={isTodoDisabled}/>

      {tasksForTodolist.map(m => <Task
        key={m.id} todolistID={todolistID}
        taskID={m.id}/>
      )}

      {tasksForTodolist.length < 1 &&
        <div style={{padding: '10px', color: 'grey', justifyContent: 'center'}}>No tasks</div>}

      <div style={{padding: '10px'}}>
        <Button size={'small'} variant={todolist.filter === "all" ? "outlined" : "text"}
                onClick={() => changeTodolistFilter('all')}>All
        </Button>
        <Button size={'small'} variant={todolist.filter === "active" ? "outlined" : "text"}
                onClick={() => changeTodolistFilter('active')} color="secondary">Active
        </Button>
        <Button size={'small'} variant={todolist.filter === "completed" ? "outlined" : "text"}
                onClick={() => changeTodolistFilter('completed')} color="primary">Completed
        </Button>
      </div>
    </Paper>
  )
})

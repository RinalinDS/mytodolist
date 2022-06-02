import React, {FC, memo, useCallback} from "react";
import {AddItemForm, AddItemFormSubmitHelperType} from "../../common/AddItemForm/AddItemForm";
import {EditableSpan} from "../../common/EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {storeHooks} from './../../../hooks'
import {Task} from "./ Task/Task";
import {Delete} from "@mui/icons-material";
import {TaskStatus} from '../../../enums';
import {FilterValueType, TaskType, TodolistDomainType} from '../../../types';
import s from './Todolist.module.css'
import {TodoActions} from '../../../store/reducers/TodolistsReducer';
import {TaskActions} from '../../../store/reducers/TasksReducer';


type TodolistPropsType = {
  todolistID: string
}

export const Todolist: FC<TodolistPropsType> = memo(({todolistID}) => {
  const {useActions, useAppDispatch, useAppSelector} = storeHooks
  const dispatch = useAppDispatch()

  const tasks = useAppSelector<Array<TaskType>>(state => state.tasks[todolistID])
  const theme = useAppSelector<string>(state => state.app.theme) // TODO selector написать
  const todolist = useAppSelector<TodolistDomainType>(state => state.todolists.filter(f => todolistID === f.id)[0])
  const {removeTodolist, changeTodolistTitle, changeFilter} = useActions(TodoActions)

  const isDarkTheme = theme === "dark";
  const changeTodolistFilter = useCallback((filter: FilterValueType) => {
    changeFilter({filter, todolistID: todolistID})
  }, [todolistID])


// ya ne ponimayu kak ya peredal funckii naverx iz additem form suda , no oni sid9t v objecte helper ,
// i tam est callbacki seteerror i settitle, voobwe eto kajets9 plohaya praktika tak delat.
  const addTasksCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
    let thunk = TaskActions.addTask({title, todolistID})
    const resultAction = await dispatch(thunk)
    if (TaskActions.addTask.rejected.match(resultAction)) {
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
    tasksForTodolist = tasks.filter(f => f.status === TaskStatus.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter(f => f.status === TaskStatus.Completed);
  }
  const isTodoDisabled = todolist.entityStatus === 'loading'
  return (
    <div className={`${s.list} ${isDarkTheme ? s.dark: s.light}`}>
      <IconButton size={'small'}
                  onClick={deleteTodolistHandler} style={{position: 'absolute', right: '13px', top: '30px'}}>
        <Delete fontSize={'small'}/>
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
    </div>
  )
})

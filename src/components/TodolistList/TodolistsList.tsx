import React, {FC, useCallback, useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import {AddItemForm, AddItemFormSubmitHelperType} from "../common/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {authSelectors, todolistSelectors} from '../../store/selectors';

import {storeHooks} from '../../hooks';
import {TodoActions} from '../../store/reducers/TodolistsReducer';
import s from './style/TodolistList.module.css'


export const TodolistsList: FC = () => {
  const {useActions, useAppDispatch, useAppSelector} = storeHooks
  const dispatch = useAppDispatch()
  const todolists = useAppSelector(todolistSelectors.selectTodolists)
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)
  const {getTodolists} = useActions(TodoActions)

  const addTodolistsCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
    let thunk = TodoActions.addTodolist(title)
    const resultAction = await dispatch(thunk)
    if (TodoActions.addTodolist.rejected.match(resultAction)) {
      if (resultAction.payload?.errors?.length) {
        const errorMessage = resultAction.payload?.errors[0]
        helper.setError(errorMessage)
      } else {
        helper.setError('some error ocurred')
      }
    } else {
      helper.setTitle('')
    }
  }, [dispatch])

  useEffect(() => {
    if (!isLoggedIn) return
    getTodolists()
  }, [])

  if (!isLoggedIn) return <Navigate to={'login'}/>

  return (
    <>
      <Grid container style={{padding: "20px"}}>
        <AddItemForm callBack={addTodolistsCallback}/>
      </Grid>
      <div className={s.test} style={{flexWrap: 'nowrap', overflowX: 'scroll', scrollbarColor: 'yellow'}}>
      {/*<Grid  container spacing={3} >*/}
        {todolists.map(m => {
          return <Grid key={m.id} item>
            <div style={{width: '300px', wordBreak: 'break-all'}}>
              <Todolist
                key={m.id}
                todolistID={m.id}
              />
            </div>
          </Grid>
        })}
      {/*</Grid>*/}
      </div>
    </>
  )
}

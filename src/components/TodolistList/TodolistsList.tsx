import React, {FC, useCallback, useEffect} from "react";
import {createTodolistTC, getTodolistsTC} from "../../store/reducers/TodolistsReducer";
import {useAppDispatch, useAppSelector} from "../../store/store";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {AddItemForm} from "../common/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {appSelectors, todolistSelectors} from '../../store/selectors';

export const TodolistsList: FC = () => {
  const dispatch = useAppDispatch()
  const todolists = useAppSelector(todolistSelectors.selectTodolists)
  const isLoggedIn = useAppSelector(appSelectors.selectIsLoggedIn)

  useEffect(() => {
    if (!isLoggedIn) return
    dispatch(getTodolistsTC())
  }, [])

  const addTodolist = useCallback((title: string) => {
    dispatch(createTodolistTC(title))
  }, [dispatch])

  if (!isLoggedIn) return <Navigate to={'login'}/>

  return (
    <>
      <Grid container style={{padding: "20px"}}>
        <AddItemForm callBack={addTodolist}/>
      </Grid>
      <Grid container spacing={10}>
        {todolists.map(m => {
          return <Grid key={m.id} item>
            <Paper style={{padding: "20px"}}>
              <Todolist
                key={m.id}
                todolistID={m.id}
              />
            </Paper>
          </Grid>
        })}
      </Grid>
    </>
  )
}

import React, {FC, useCallback, useEffect} from "react";
import {createTodolistTC, getTodolistsTC} from "./TodolistsReducer";
import {useAppDispatch, useAppSelector} from "../../app/store";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {TodolistDomainType} from '../../types';

export const TodolistsList: FC = () => {
  const dispatch = useAppDispatch()
  const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
  const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

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

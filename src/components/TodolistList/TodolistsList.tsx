import React, {FC, useEffect} from "react";
import {useActions, useAppSelector} from "../../store/store";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {AddItemForm} from "../common/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {authSelectors, todolistSelectors} from '../../store/selectors';
import {todolistsActions} from '../../store/reducers/actions';

export const TodolistsList: FC = () => {
  const todolists = useAppSelector(todolistSelectors.selectTodolists)
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)

  const {getTodolists, addTodolist} = useActions(todolistsActions)

  useEffect(() => {
    if (!isLoggedIn) return
    getTodolists()
  }, [])

  if (!isLoggedIn) return <Navigate to={'login'}/>

  return (
    <>
      <Grid container style={{padding: "20px"}}>
        <AddItemForm callBack={addTodolist}/>
      </Grid>
      <Grid container spacing={10}>
        {todolists.map(m => {
          return <Grid key={m.id} item>
            <Paper style={{padding: "20px", backgroundColor: 'aliceblue'}}>
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

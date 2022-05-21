import React, {FC, useCallback, useEffect} from "react";
import {useActions, useAppSelector} from "../../store/store";
import Grid from "@material-ui/core/Grid";
import {AddItemForm} from "../common/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {authSelectors, todolistSelectors} from '../../store/selectors';
import {todolistsActions} from '../../store';


export const TodolistsList: FC = () => {
  const todolists = useAppSelector(todolistSelectors.selectTodolists)
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)

  const {addTodolist, getTodolists} = useActions(todolistsActions)

  const addTodolistsCallback = useCallback(async (title: string) => {
    addTodolist(title)
  }, [])

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
      <Grid container spacing={3} style={{flexWrap: 'nowrap', overflowX: 'scroll'}}>
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
      </Grid>
    </>
  )
}

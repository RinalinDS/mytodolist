import React, {FC, useCallback, useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import {AddItemForm, AddItemFormSubmitHelperType} from "../common/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {authSelectors, todolistSelectors} from '../../store/selectors';
import {asyncActions as todolistsActions} from '../../store/reducers/Todolist/TodolistsReducer'
import {storeHooks} from '../../hooks';


export const TodolistsList: FC = () => {
  const {useActions, useAppDispatch, useAppSelector} = storeHooks
  const dispatch = useAppDispatch()
  const todolists = useAppSelector(todolistSelectors.selectTodolists)
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)
  const {getTodolists, addTodolist} = useActions(todolistsActions)

  const addTodolistsCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
    let thunk = addTodolist(title)
    const resultAction = await dispatch(thunk)
    if (addTodolist.rejected.match(resultAction)) {
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

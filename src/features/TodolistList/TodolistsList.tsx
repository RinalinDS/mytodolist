import React, {useCallback, useEffect} from "react";
import {createTodolistTC, getTodolistsTC, TodolistDomainType} from "../TodolistsReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";

export const TodolistsList = () => {
    useEffect(() => {
        dispatch(getTodolistsTC())
    }, [])

    const dispatch = useDispatch()
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)

    const addTodolist = useCallback((title: string) => {
        dispatch(createTodolistTC(title))
    }, [dispatch])

    return (
        <>
            <Grid container style={{padding: "20px"}}>
                <AddItemForm callBack={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {todolists.map(m => {


                    return <Grid key={m.id} item>
                        <Paper style={{padding: "10px"}}>
                            <Todolist
                                key={m.id}
                                todolistID={m.id}
                            />
                        </Paper>
                    </Grid>

                })
                }
            </Grid>
        </>
    )

}
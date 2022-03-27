import React, {useEffect} from 'react';
import './App.css';
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Menu from "@mui/icons-material/Menu";
import CircularProgress from '@mui/material/CircularProgress';
import {TodolistsList} from "../features/TodolistList/TodolistsList";
import {initializeAppTC, RequestStatusType} from "./AppReducer";
import {useAppSelector} from "./store";
import {ErrorSnackbar} from "../components/SnackbarError/SnackbarError";

import {Login} from '../features/Login/Login';
import {Navigate, Route, Routes} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {logoutTC} from '../features/Login/authReducer';



export function App() {
    const status = useAppSelector<RequestStatusType>(state => state.app.status)
    const isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)
    const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(initializeAppTC())
    }, [])


    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    {/*<IconButton*/}
                    {/*    edge="start"*/}
                    {/*    color="inherit"*/}
                    {/*    aria-label="menu"*/}
                    {/*>*/}
                    {/*    <Menu/>*/}
                    {/*</IconButton>*/}
                    {/*<Typography variant="h6">*/}
                    {/*    News*/}
                    {/*</Typography>*/}
                    {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color={'secondary'}/>}
            <Container fixed>

                <Routes>
                    <Route path={'login'} element={<Login/>}/>
                    <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'404'} element={<h1>Someone FUCKED UP</h1>} />
                    <Route path={'*'} element={<Navigate to={'404'} />} />

                </Routes>
            </Container>
            <ErrorSnackbar/>
        </div>


    );
}



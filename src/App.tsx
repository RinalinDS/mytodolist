import React, {FC, useEffect} from 'react';
import LinearProgress from "@material-ui/core/LinearProgress";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import CircularProgress from '@mui/material/CircularProgress';
import {TodolistsList} from "./components/TodolistList/TodolistsList";
import {useActions, useAppDispatch, useAppSelector} from "./store/store";
import {ErrorSnackbar} from "./components/common/SnackbarError/SnackbarError";
import {Login} from './components/Login/Login';
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import {logoutTC} from './store/reducers/authReducer';
import {RequestStatusType} from './types';
import {appSelectors, authSelectors} from './store/selectors';
import {initializeApp} from './store/reducers/actions/AppActions';
import {AppActions} from './store/reducers/actions';


export const App:FC = () => {
  const status = useAppSelector<RequestStatusType>(appSelectors.selectStatus)
  const isInitialized = useAppSelector<boolean>(appSelectors.selectIsInitialized)
  const isLoggedIn = useAppSelector<boolean>(authSelectors.selectIsLoggedIn)
  const dispatch = useAppDispatch()
  const navigate = useNavigate();

  const { initializeApp } = useActions(AppActions)

  useEffect(() => {
    initializeApp()
  }, [])


  const logoutHandler = () => {
    dispatch(logoutTC())
  }
  const backHomeHandler = () => {
    navigate('/')
  }

  if (!isInitialized) {
    return <div
      style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
      <CircularProgress/>
    </div>
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" onClick={backHomeHandler}>Home</Button>
          {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}

        </Toolbar>
      </AppBar>
      {status === 'loading' && <LinearProgress color={'secondary'}/>}
      <Container fixed>
        <Routes>
          <Route path={'/'} element={<TodolistsList/>}/>
          <Route path={'/login'} element={<Login/>}/>
          <Route path={'/404'} element={<h1>Someone FUCKED UP</h1>}/>
          <Route path={'*'} element={<Navigate to={'/404'}/>}/>
        </Routes>
      </Container>
      <ErrorSnackbar/>
    </div>


  );
}



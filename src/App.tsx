import React, {FC, useEffect} from 'react';
import LinearProgress from "@material-ui/core/LinearProgress";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import {TodolistsList} from "./components/TodolistList/TodolistsList";
import {storeHooks} from './hooks'
import {ErrorSnackbar} from "./components/common/SnackbarError/SnackbarError";
import {Login} from './components/Login/Login';
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import {appSelectors, authSelectors} from './store/selectors';
import {authActions} from './store';
import {InitializePreloader} from './components/common/Prealoder/InitializePreloader';
import {Path} from './enums';
import {appActions} from './store/reducers/Application';


export const App: FC = () => {
  const {useActions, useAppSelector} = storeHooks
  const navigate = useNavigate();

  const status = useAppSelector(appSelectors.selectStatus)
  const isInitialized = useAppSelector(appSelectors.selectIsInitialized)
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn)


  const {initializeApp} = useActions(appActions)
  const {logout} = useActions(authActions)

  useEffect(() => {
    initializeApp()
    // это все та же строка dispatch(initilizeAppTC()),но теперь , благодаря хуку useActions, вызов происходит скрыто от нас, но это просто фикция)
  }, [])


  const logoutHandler = () => {
    logout()
    // это все та же строка dispatch(logoutTC()),но теперь , благодаря хуку useActions, вызов происходит скрыто от нас, но это просто фикция)
  }
  const backHomeHandler = () => {
    navigate('/')
  }

  if (!isInitialized) {
    return <InitializePreloader/>
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
      <Container fixed style={{marginBottom: '50px'}}>
        <Routes>
          <Route path={Path.Home} element={<TodolistsList/>}/>
          <Route path={Path.Login} element={<Login/>}/>
          <Route path={Path.ErrorPage} element={<h1>Someone FUCKED UP</h1>}/>
          <Route path={Path.AnyOther} element={<Navigate to={Path.ErrorPage}/>}/>
        </Routes>
      </Container>
      <ErrorSnackbar/>
    </div>


  );
}



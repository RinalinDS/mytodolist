import React from 'react';
import './App.css';
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import {TodolistsList} from "../features/TodolistList/TodolistsList";
import {useSelector} from "react-redux";
import {RequestStatusType} from "./AppReducer";
import {AppRootStateType, useAppSelector} from "./store";
import {ErrorSnackbar} from "../components/SnackbarError/SnackbarError";
import {Menu} from "@mui/icons-material";



export function App() {
    const status = useAppSelector<RequestStatusType>(state => state.app.status)

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color={'secondary'}/>}
            <Container fixed>
                <TodolistsList/>
            </Container>
            <ErrorSnackbar />
        </div>


    );
}



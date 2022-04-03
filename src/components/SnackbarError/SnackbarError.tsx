import React from 'react';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {useAppSelector} from "../../app/store";
import {NullableType, setAppErrorAC} from "../../app/AppReducer";
import {useDispatch} from "react-redux";


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ErrorSnackbar() {
    const error = useAppSelector<NullableType<string>>(state => state.app.error)
    const dispatch = useDispatch()

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setAppErrorAC({error: null}));
    };

    return (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                {error}
            </Alert>
        </Snackbar>
    );
}

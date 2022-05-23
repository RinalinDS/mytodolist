import React from 'react';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {storeHooks} from './../../../hooks'
import {appSelectors} from '../../../store/selectors';
import {appActions} from '../../../store/reducers/Application';



const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ErrorSnackbar() {
  const {setAppError} = appActions
  const {useAppDispatch, useAppSelector} = storeHooks
  const error = useAppSelector(appSelectors.selectError)
  const dispatch = useAppDispatch()

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(setAppError({error: null}));
  };

  return (
    <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
        {error}
      </Alert>
    </Snackbar>
  );
}

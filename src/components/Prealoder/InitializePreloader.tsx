import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export const InitializePreloader = () => {
  return <div
    style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
    <CircularProgress/>
  </div>

};

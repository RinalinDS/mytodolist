import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from 'formik';
import {loginTC} from './authReducer';
import {useAppDispatch, useAppSelector} from '../../app/store';
import {Navigate} from 'react-router-dom';
import {LoginParamsType} from '../../types';


type FormValuesType = {
  email: string
  password: string
  rememberMe: boolean
}

export const Login = () => {
  const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)
  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validate: values => {
      const errors: Partial<Omit<LoginParamsType, "captcha">> = {};
      if (!values.password) {
        errors.password = 'Required';
      } else if (values.password.length < 3) {
        errors.password = 'Must be 3 characters or more';
      }
      if (!values.email) {
        errors.email = 'Required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      return errors;
    },
    onSubmit: async (values, formikHelpers: FormikHelpers<FormValuesType>) => {
      const action = await dispatch(loginTC(values)) // придет либо loginTC.fullfilled, libo rejected
      if (loginTC.rejected.match(action)) { // из документации. Если тип актиона = rejected , то значит в пейлоаде
        // будет fields error , и значит можно его записывать в локальный стейт формика с помощью формикхелпепа
        if (action.payload?.fieldsError) {
          const error = action.payload.fieldsError[0]
          console.log(error)
          formikHelpers.setFieldError(error.field, error.error)
        }
      }
    },
  })
  if (isLoggedIn) return <Navigate to={'/'}/>

  return <Grid container justifyContent={'center'}>
    <Grid item justifyContent={'center'}>
      <FormControl>
        <FormLabel>
          <p>To log in get registered
            <a href={'https://social-network.samuraijs.com/'}
               target={'_blank'}> here
            </a>
          </p>
          <p>or use common test account credentials:</p>
          <p>Email: free@samuraijs.com</p>
          <p>Password: free</p>
        </FormLabel>

        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <TextField label="Email" margin="normal" {...formik.getFieldProps('email')}/>
            {formik.touched.email && formik.errors.email &&
              <div style={{color: 'red'}}>{formik.errors.email}</div>}
            <TextField type="password" label="Password"
                       margin="normal"  {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password &&
              <div style={{color: 'red'}}>{formik.errors.password}</div>}
            <FormControlLabel label={'Remember me'}
                              control={<Checkbox {...formik.getFieldProps('rememberMe')}/>}/>
            <Button type={'submit'} variant={'contained'} color={'primary'}>
              Login
            </Button>
          </FormGroup>
        </form>

      </FormControl>
    </Grid>
  </Grid>
}

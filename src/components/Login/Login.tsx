import React, {FC} from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from 'formik';
import {loginTC} from '../../store/reducers/authReducer';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {Navigate} from 'react-router-dom';
import {FormValuesType, LoginParamsType} from '../../types';
import {authSelectors} from '../../store/selectors/';


export const Login: FC = () => {
  const isLoggedIn = useAppSelector<boolean>(authSelectors.selectIsLoggedIn)
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
      const action = await dispatch(loginTC(values)) // придет либо loginTC.fulfilled, или rejected
      if (loginTC.rejected.match(action)) { //Из документации. Если тип action = rejected, то значит в пейлоаде
        // будет fields error, и значит можно его записывать в локальный state formik с помощью formikHelper
        if (action.payload?.fieldsError) {
          const error = action.payload.fieldsError[0]
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

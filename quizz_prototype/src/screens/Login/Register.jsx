import { FormLabel, Button, Typography, Grid, TextField } from '@mui/material'
import {  bgRegister } from 'assets'
import { useFormik } from 'formik'
import { gapi } from 'gapi-script'
import React from 'react'
import FacebookLogin from 'react-fb-social-login'

import GoogleLogin from 'react-google-login'
import { IoLogoFacebook, IoLogoGoogle } from 'react-icons/io'

import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { register, socialLogin } from 'store/Actions/auth.action'

import { registerFormSchema } from './validation/register_validation'

const Register = () => {

    const dispatch = useDispatch()
    const {errors: backendErrors} = useSelector(state => state.authReducer)

    const {values: {
      name,
      nickname,
      email,
      password,
      passwordConfirm
    },
    setFieldValue,
    handleSubmit,
    setTouched,
    errors
  } = useFormik({
      initialValues: {
        name: '',
        nickname: '',
        email: '',
        password: '',
        passwordConfirm: '',
      },
      validationSchema: registerFormSchema,
      onSubmit: data => submitRegisterForm(data),
    })

    React.useEffect(() => {
        function start() {
          gapi.client.init({
            clientId: process.env.REACT_APP_GOOGLE_APP_ID,
            scope: 'email',
          });
        }
    
        gapi.load('client:auth2', start);
      }, [])

    const responseGoogle = (response) => {
        dispatch(socialLogin({
            provider: 'google',
            access_token: response.accessToken
        }))
    }

    const responseFacebook = (response) => {
        dispatch(socialLogin({
          provider: 'facebook',
          access_token: response.accessToken
        }))
    }

    const submitRegisterForm =  data => {
      dispatch(register(data))
    }

  return (
    <div className="min-h-screen w-[100vw] bg-sky-300 flex items-center md:px-8 px-5 py-3">
      <div className="container mx-auto flex items-start md:h-[90vh] bg-white rounded-[3rem] md:overflow-hidden shadow-md">
        <div className='md:basis-2/5 md:block hidden h-[100%]'>
          <img src={bgRegister} className=' h-[100%] object-cover object-bottom' alt='background-login' />
        </div>
        <div className='py-4 px-4 flex flex-col items-center flex-1 h-[100%] md:mx-8'>
          <div className='mx-auto my-auto'>
            <div className="flex-1 text-center">
              <Typography className='md:text-[2rem] text-[2rem]'>Registre-se no <span className='text-blue-600 font-bold'>Quizada</span></Typography>
              <Typography className='md:text-[1rem] text-[1rem] mt-4 md:m-0'>E começe a criar seu quizz hoje mesmo!</Typography>
            </div>

            <Grid container spacing={2}>
                <Grid
                item
                md={6}
                xs={12}
                className='mt-5'
                >
                    <FormLabel>Nome</FormLabel>
                    <TextField
                    size='small'
                    value={name}
                    fullWidth
                    variant='outlined'
                    id='name'
                    error={(errors.name ? true: false) || (backendErrors?.name ? true : false)}
                    helperText={(errors.name && errors.name) || (backendErrors?.name && backendErrors.name[0])}
                    onChange={e => setFieldValue('name', e.target.value)}
                    onFocus={() => setTouched(true)}
                    />
                </Grid>
                <Grid
                item
                md={6}
                xs={12}
                className='mt-5'
                >
                    <FormLabel>Apelido</FormLabel>
                    <TextField
                    size='small'
                    fullWidth
                    value={nickname}
                    error={(errors.nickname ? true: false) || (backendErrors?.nickname ? true : false)}
                    helperText={(errors.nickname && errors.nickname) || (backendErrors?.nickname && backendErrors.nickname[0])}
                    id='nickname'
                    onChange={e => setFieldValue('nickname', e.target.value)}
                    
                    />
                </Grid>

                <Grid
                item
                md={12}
                xs={12}
                >
                    <FormLabel>Email</FormLabel>
                    <TextField
                    size='small'
                    value={email}
                    error={(errors.email ? true: false) ||  (backendErrors?.email ? true : false)}
                    helperText={(errors.email && errors.email)  || (backendErrors?.email && backendErrors.email[0])}
                    fullWidth
                    variant='outlined'
                    type={'email'}
                    id='email'
                    onChange={e => setFieldValue('email', e.target.value)}
                    />
                </Grid>

                <Grid
                item
                md={6}
                xs={12}
                >

                    <FormLabel>Senha</FormLabel>
                    <TextField
                    size='small'
                    value={password}
                    error={(errors.password ? true: false) || (backendErrors?.password ? true : false)}
                    helperText={(errors.password && errors.password) || (backendErrors?.password && backendErrors.password[0])}
                    fullWidth
                    variant='outlined'
                    id='password'
                    type={'password'}
                    onChange={e => setFieldValue('password', e.target.value)}
                    />
                </Grid>

                <Grid
                item
                md={6}
                xs={12}
                >
                    <FormLabel>Confirmação de senha</FormLabel>
                    <TextField
                    size='small'
                    value={passwordConfirm}
                    error={errors.passwordConfirm ? true: false}
                    helperText={errors.passwordConfirm && errors.passwordConfirm}
                    fullWidth
                    variant='outlined'
                    type={'password'}
                    id='passwordConfirm'
                    onChange={e => setFieldValue('passwordConfirm', e.target.value)}
                    />
                </Grid>
            </Grid>

            <div className="flex justify-center mt-5 flex-wrap">
              <Button
              size='large'
              variant='contained'
              className='bg-blue-400 mx-2 hover:bg-orange-400 w-[180px] h-[2rem]  md:mt-0 mt-2 '
              onClick={handleSubmit}
              >
                Registrar-se
              </Button>
            </div>

            <div className='text-center my-2'>
                <h5>Já tem uma conta?</h5>
                <Link to='/'>
                    <Button
                        size='large'
                        variant='contained'
                        color='secondary'
                        className='w-[180px] md:mt-0 mt-2 h-[2rem]'
                    >Fazer Login
                    </Button>
                </Link>
            </div>

            {/* <div className='text-center mt-4'>
              Ou registrar-se atrvés das redes sociais.
              <div className="flex justify-center items-center mt-5 mb-5 md:mt-0">
                <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_APP_ID}
                onSuccess={responseGoogle}
                isSignedIn={false}
                buttonText=''
                render={renderProps => (
                  <IoLogoGoogle onClick={renderProps.onClick} size={35} className='mx-2 text-red-600 cursor-pointer'/>
                )}
                />

                <FacebookLogin
                  appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                  autoLoad={false}
                  fields="name,email,picture"
                  
                  callback={responseFacebook}
                  cssClass="bg-transparent flex items-center p-0"
                  icon={<IoLogoFacebook size={40} className='mx-2 text-blue-600 cursor-pointer'/>}
                  textButton=''
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
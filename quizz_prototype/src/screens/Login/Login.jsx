import { Button, FormLabel, Typography, InputBase } from '@mui/material'
import React from 'react'

import FacebookLogin from 'react-fb-social-login'
import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';

import { IoLogoFacebook, IoLogoGoogle } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { bgLogin, logo } from '../../assets'

import { change, login, socialLogin } from '../../store/Actions/auth.action'

import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { changeAlert } from 'store/Actions/alert.action';
import PrivacyPolicies from 'components/privacy_policy/PrivacyPolicies';



const Login = () => {

  const navigate = useNavigate()

  const credentials = useSelector(state => state.authReducer.credentials)
  const success = useSelector(state => state.authReducer.success)

  const dispatch = useDispatch()
  let location = useLocation();

  const responseFacebook = (response) => {
    dispatch(socialLogin({
      provider: 'facebook',
      access_token: response.accessToken
    }))
  }

  const responseGoogle = (response) => {
    dispatch(socialLogin({
      provider: 'google',
      access_token: response.accessToken
    }))
  }

  React.useEffect(() => {
    let url = new URLSearchParams(location.search)
    let urlParams = Object.fromEntries(url.entries());

    if(urlParams?.message){
      dispatch(changeAlert({open: true, msg: urlParams?.message}))
    }

    if (urlParams?.verify_email && urlParams?.signature) {
      axios.get(urlParams?.verify_email, { params: { signature: urlParams?.signature, hash: urlParams?.hash } })
      .then(res => {
       
          if (res.status === 200 && res.data.success) {
            navigate('/home', { replace: true })
            dispatch(changeAlert({ open: true, msg: res.data.success, class: 'success' }))
          }
        })
        .catch(err => {
          if (parseInt(err.response.status) === 401 || parseInt(err.response.status) === 403) {
            navigate('/', { replace: true })
            dispatch(changeAlert({ open: true, msg: err.response.data.message, class: 'error' }))
          }
        })
    }
  }, [])

  React.useEffect(() => {
    if (success) {
      navigate('/home', { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success])

  React.useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_APP_ID,
        scope: 'email',
      });
    }

    gapi.load('client:auth2', start);
  }, [])




  return (
    <div className="min-h-screen w-[100vw] bg-sky-300 flex items-center md:px-8 px-5 py-3">
      <div className="container mx-auto flex items-start md:h-[90vh] bg-white rounded-[3rem] md:overflow-hidden shadow-md">
        <div className='md:basis-2/5 md:block hidden h-[100%]'>
          <img src={bgLogin} className=' h-[100%] object-cover object-bottom' alt='background-login' />
        </div>
        <div className='py-4 px-4 flex flex-col items-center flex-1 h-[100%]'>
          <div className='mx-auto my-auto'>
            <img src={logo} alt="quizzada logo" width={80} className='my-2 md:my-4 mx-auto' />
            <div className="flex-1 text-center">
              <Typography className='md:text-[2rem] text-[2rem]'>Bem Vindo ao <span className='text-blue-600 font-bold'>Quizada</span></Typography>
              <Typography className='md:text-[1rem] text-[1rem] mt-4 md:m-0'>Seu aplicativo de perguntas e respostas personalizado!</Typography>
            </div>

            <div className="mt-4">
              <FormLabel className='mt-5 mb-1'>Nome ou email</FormLabel>
              <InputBase
                value={credentials.email}
                onChange={e => dispatch(change({ email: e.target.value }))}
                fullWidth className='border-solid border rounded-[2rem] px-4 py-2' size='medium' type={'email'} />
            </div>


            <div className="mt-4">
              <FormLabel className='mt-6 mb-1'>Senha</FormLabel>
              <InputBase
                value={credentials.password}
                onChange={e => dispatch(change({ password: e.target.value }))}
                fullWidth className='border-solid border rounded-[2rem] px-4 py-2' size='medium' type={'password'} />
            </div>

            <Typography
              className='self-center text-center mt-4 hover:text-blue-600 cursor-pointer'
              onClick={() => navigate('/forgot-password', { replace: true })}
            >
              Esqueceu a senha?
            </Typography>

            <div className="flex justify-center mt-5 mb-5 flex-wrap">
              <Button
                size='large'
                variant='contained'
                className='bg-blue-400 mx-2 hover:bg-orange-400 w-[180px] h-[2rem]  md:mt-0 mt-2 '
                onClick={() => dispatch(login(credentials))}
              >
                Login
              </Button>
              <Link to='register'>
                <Button
                  size='large'
                  variant='contained'
                  color='secondary'
                  className='w-[180px] md:mt-0 mt-2 h-[2rem]'
                >Registrar-se
                </Button>
              </Link>
            </div>

            {/* <div className='text-center'>
              Ou fazer login com
              <div className="flex justify-center items-center mt-5 mb-5 md:mt-0">
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_APP_ID}
                  onSuccess={responseGoogle}
                  isSignedIn={false}
                  buttonText=''
                  render={renderProps => (
                    <IoLogoGoogle onClick={renderProps.onClick} size={35} className='mx-2 text-red-600 cursor-pointer' />
                  )}
                />

                <FacebookLogin
                  appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                  autoLoad={false}
                  fields="name,email,picture"

                  callback={responseFacebook}
                  cssClass="bg-transparent flex items-center p-0"
                  icon={<IoLogoFacebook size={40} className='mx-2 text-blue-600 cursor-pointer' />}
                  textButton=''
                />

              </div>
              <PrivacyPolicies />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
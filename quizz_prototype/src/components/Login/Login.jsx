import { Button, FormLabel, Typography, InputBase } from '@mui/material'
import React from 'react'
import { IoLogoFacebook, IoLogoGoogle } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { bgLogin, logo } from '../../assets'

import { change, login } from '../../store/Actions/auth.action'


const Login = () => {

  const navigate = useNavigate()

  const credentials = useSelector(state => state.authReducer.credentials)
  const success = useSelector(state => state.authReducer.success)

  const dispatch = useDispatch()

  React.useEffect(() => {
    if(success) {
      navigate('/home', {replace: true})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[success] )

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
              <Typography className='md:text-[2rem] text-[2rem]'>Bem Vindo ao <span className='text-blue-600 font-bold'>Quizzada</span></Typography>
              <Typography className='md:text-[1rem] text-[1rem] mt-4 md:m-0'>Seu aplicativo de perguntas e respostas personalizado!</Typography>
            </div>

            <div className="mt-4">
            <FormLabel className='mt-5 mb-1'>Nome ou email</FormLabel>
            <InputBase
            value={credentials.email}
            onChange={e => dispatch(change({email: e.target.value}))}
            fullWidth className='border-solid border rounded-[2rem] px-4 py-2' size='medium' type={'email'} />
            </div>


            <div className="mt-4">
              <FormLabel className='mt-6 mb-1'>Senha</FormLabel>
              <InputBase
              value={credentials.password}
              onChange={e => dispatch(change({password: e.target.value}))}
              fullWidth className='border-solid border rounded-[2rem] px-4 py-2' size='medium' type={'password'} />
            </div>

            <Typography className='self-center text-center mt-4'>Esqueceu a senha?</Typography>

            <div className="flex justify-center mt-5 mb-5 flex-wrap">
              <Button
              size='large'
              variant='contained'
              className='bg-blue-400 mx-2 hover:bg-orange-400 w-[180px] h-[2rem]  md:mt-0 mt-2 '
              onClick={() => dispatch(login(credentials))}
              >
                Login
              </Button>
              <Button size='large' variant='outlined' className='hover:bg-orange-400 hover:border-none hover:text-white w-[180px] md:mt-0 mt-2 h-[2rem]'>Registrar-se</Button>
            </div>

            <div className='text-center'>
              Ou fazer login com
              <div className="flex justify-center items-center mt-5 mb-5 md:mt-0">
                <IoLogoGoogle className='mx-2 text-red-600' size={30} />
                <IoLogoFacebook className='mx-2 text-blue-600' size={35} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
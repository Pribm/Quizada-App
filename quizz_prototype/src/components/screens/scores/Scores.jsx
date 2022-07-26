import { Avatar, Button, Typography } from '@mui/material'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ranking } from 'store/Actions/user.action'

const Scores = () => {

  const dispatch = useDispatch()
  const {user, users} = useSelector(state => state.userReducer)

  useEffect(() => {
    dispatch(ranking())
  }, [])

  return (
    <div className='container flex justify-center flex-col items-center fixed bottom-0 right-[50%] translate-x-[50%] max-w-[768px]' style={{height: 'calc(100vh - 85px)'}}>
      <div className='flex justify-center flex-col items-center h-[35%] w-[100%]' >
        <Avatar src={user.avatar} alt={user.name} className='w-[120px] h-[120px]'/>
        <Typography className='text-white' variant='h6'>
          {user.name}
        </Typography>
        <div className='bg-white text-blue-500 px-4 py-2 rounded-sm'>
        <Typography variant='p'>
          {user.score} Pontos
          <hr />
          {user.Ranking}º Posição
        </Typography>
        </div>
      </div>
      <div className='px-4 mt-2 text-center'>
        <Typography variant='h4' className='text-white md:text-4xl text-2xl'>Ranking dos 100 primeiros colocados.</Typography>
      </div>
      <div className='overflow-y-scroll scrollbar h-[60%] mt-4 w-[100%] px-4'>
        {
          users?.data?.map((u, i) => (
            <div key={'ranking_user_'+i} className='flex justify-between rounded-md items-center bg-white p-4 mb-6 h-[80px]'>
              <Avatar src={u.avatar} alt={u.name}/>
              <div className='text-center'>
                {u.name}
                <hr />
                {u.score} Pontos
              </div>
              <Typography variant='p'>
                {u.Ranking}º Lugar
              </Typography>
            </div>
          ))
        }
      </div>
      <div className='mb-[70px] mt-4'>
        <Button variant='contained' color='secondary'>
          Fazer Quizz
        </Button>
      </div>
    </div>
  )
}

export default MenuWrapper(Scores)
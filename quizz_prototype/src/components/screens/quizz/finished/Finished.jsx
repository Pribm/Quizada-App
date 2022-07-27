import { Button, CircularProgress, Paper, Typography } from '@mui/material'
import FinishedQuizzCard from 'components/quizzCard/FinishedQuizzCard'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import React, { useEffect, useState } from 'react'
import { FcFolder } from 'react-icons/fc'
import { MdHome } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getQuizzComplete } from 'store/Actions/user.action'

const Finished = () => {

  const [isLoading, setLoading] = useState(true)

  const dispatch = useDispatch()
  const { quizzComplete } = useSelector(state => state.userReducer)

  useEffect(() => {
    dispatch(getQuizzComplete({showCompletedQuizzList: true})).then(() => setLoading(false))
  }, [])

  return (
    <div className='container md:w-[60vw] mx-[auto] min-h-[calc(100vh-180px)] text-center p-4'>
      <Typography className='text-white text-xl'>Quizzes Finalizados</Typography>
      {!isLoading ?
        quizzComplete.data?.length > 0 ?
        quizzComplete.data?.map((quizz, i) => <FinishedQuizzCard props={{ ...quizz, dispatch }} key={'quizz_card' + i} />)
          :
          <Paper className='flex flex-col items-center p-4 w-[100%]'>
            <FcFolder size={100} />
            <h1 className='text-center'>Você ainda não completou nenhum quizz.</h1>
            <Button  variant='contained' className='mt-4'>
            <Link to='/home' className='flex '>
              <MdHome size={25}/>
              <h5 className='ml-2'>Home</h5>
            </Link>
            </Button>
          </Paper>

        :
        <div className='flex flex-1 justify-center'>
          <CircularProgress />
        </div>
      }
    </div>
  )
}

export default MenuWrapper(Finished)
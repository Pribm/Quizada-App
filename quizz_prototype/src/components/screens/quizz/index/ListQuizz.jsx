import { Button, CircularProgress, Paper } from '@mui/material'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import React, { useEffect, useState } from 'react'
import { FcFolder } from 'react-icons/fc'
import { useDispatch, useSelector } from 'react-redux'
import { index } from 'store/Actions/quizz.action'
import { useNavigate } from 'react-router-dom'
import QuizzCard from 'components/quizzCard/QuizzCard'




const IndexQuestions = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { quizz_list } = useSelector(state => state.quizzReducer)
  const { quizz:{quizzCreated} } = useSelector(state => state.gameReducer)

  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(index()).then(() => setLoading(false))
  }, [])



  useEffect(() => {
    if(quizzCreated){
      navigate('/quizz', {replace: true})
    }
  }, [quizzCreated])

  return (
    <div className='container md:w-[60vw] mx-[auto] p-4 flex flex-wrap justify-center'>
      {!isLoading ?
        quizz_list.data?.length > 0 ?
          quizz_list.data?.map((quizz, i) => <QuizzCard props={{ ...quizz, dispatch }} key={'quizz_card' + i} />)
          :
          <Paper className='flex flex-col items-center p-4 w-[100%]'>
            <FcFolder size={100} />
            <h1 className='text-center'>Você ainda não possui nenhum quizz cadastrado, gostaria de criar um?</h1>
            <Button
              onClick={() => navigate('/quizz/create', { replace: true })}
              variant='contained'
              className='mt-2'>
              Sim, por favor!
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

export default MenuWrapper(IndexQuestions)
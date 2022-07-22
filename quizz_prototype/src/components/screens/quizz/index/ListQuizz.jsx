import { Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Paper, Typography } from '@mui/material'
import { logo } from 'assets'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import React, { useEffect, useState } from 'react'
import { FcFolder } from 'react-icons/fc'
import { HiTrash } from 'react-icons/hi'
import { IoMdCopy } from 'react-icons/io'

import { useDispatch, useSelector } from 'react-redux'
import { changeConfirm } from 'store/Actions/confirm.action'
import { destroy, index } from 'store/Actions/quizz.action'

import { useNavigate } from 'react-router-dom'
import { getQuizzThumbnail } from 'utils/getThumbnails'
import { MdGamepad } from 'react-icons/md'
import { changeAlert } from 'store/Actions/alert.action'
import DownloadQuizzSpreadsheet from 'components/buttons/DownloadQuizzSpreadsheet'
import { show } from 'store/Actions/game.action'

const QuizzCard = ({ props }) => (
  <Card className='mb-4 mx-2 flex flex-col' sx={{ width: 345 }}>
      <DownloadQuizzSpreadsheet fileName={props.title} quizzId={props.id}/>
      <CardMedia
        component={'img'}
        image={props.image ? getQuizzThumbnail(props.image) : logo}
        alt="logo"
        height="140px"
        className='h-[350px]'
      />
      <CardContent>
        <Typography  variant='h5' component={'div'}>
          {props.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.description}
        </Typography>
        
        <div className="flex items-center justify-between">
          <Typography  variant='h6' component={'div'} className='text-orange-600 mt-2'>
            {props.category?.name ? props.category.name : 'Quizz sem categoria'}
          </Typography>
          <Typography
          onClick={() => {
            navigator.clipboard.writeText(props.token)
            props.dispatch(changeAlert({ open: true, msg: 'Token copiado para a área de transferência', class: 'success' }))
          }}
          className='flex px-2 items-center text-sky-600 rounded-lg cursor-pointer'
          variant='h6'
          sx={{border: 'solid rgb(2,132,199) 1px'}}>
            <IoMdCopy className='mr-2'/>
            {props.token}
          </Typography>
        </div>
      </CardContent>

    <CardActions className='justify-center mb-2 mt-auto'>
        <Button
        className='flex items-center'
        variant='contained'
        size="small"
        color="error"
        onClick={() => props.dispatch(changeConfirm({
          open: true,
          msg: 'Você tem certeza que deseja deletar este quizz?',
          confirmAction: () => props.dispatch(destroy(props.id))
        }))}
        >
          <HiTrash className='mr-2'/>
          Apagar quizz
        </Button>

        <Button
        className='flex items-center'
        variant='contained'
        size="small"
        color="primary"
        onClick={() => props.dispatch(changeConfirm({
          open: true,
          title: 'Você está preparado para iniciar o quizz?',
          msg: 'Atenção, os quizzes criados por você não concedem pontuação para o ranking, para ganhar pontos você precisa fazer um quizz gerado por outra pessoa.',
          confirmAction: () => props.dispatch(show(props.token)).then(() => {
            props.dispatch(changeConfirm({open: false}))
          })
        }))}
        >
          <MdGamepad className='mr-2'/>
          Fazer Quizz
        </Button>
    </CardActions>
  </Card>
)

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
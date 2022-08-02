import React from 'react'

import { HiTrash } from 'react-icons/hi'
import { logo } from 'assets'
import { IoMdCopy } from 'react-icons/io'

import { Card, CardActions, CardContent, CardMedia, Typography, Button, Grid, Paper, Fab, Chip, Avatar } from '@mui/material'
import { changeConfirm } from 'store/Actions/confirm.action'

import { destroy } from 'store/Actions/quizz.action'

import { getQuizzThumbnail, getUserThumbnail } from 'utils/getThumbnails'
import { MdGamepad } from 'react-icons/md'
import { changeAlert } from 'store/Actions/alert.action'
import DownloadQuizzSpreadsheet from 'components/buttons/DownloadQuizzSpreadsheet'
import { show } from 'store/Actions/game.action'
import { BiTrophy } from 'react-icons/bi'
import RankingModal from 'components/ranking/RankingModal'

const QuizzCard = ({ props }) => {

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Grid container component={Paper} className='my-4 text-left bg-slate-50 relative'>
        {
          props.exportQuizzButton &&
          <Grid item xs={12}>
            <DownloadQuizzSpreadsheet fileName={props.title} quizzId={props.id} />
          </Grid>
        }
        <Grid item xs={4}>
          <img src={props.image ? getQuizzThumbnail(props.image) : logo} alt={props.title} className='w-[100px] h-[100px] m-2 object-cover' />
        </Grid>
        <Grid item xs={8} className='p-2'>
          <h1 className='text-lg'>{props.title}</h1>
          <h2 className='text-orange-500 text-base'>{props.category?.name}</h2>
          {
            props.showUser &&
            <>
              <hr />
              <h3 className='text-base my-1'>Convidado por:</h3>
              <Chip
                avatar={<Avatar alt={props.user.name} src={props.user.avatar ? getUserThumbnail(props.user.avatar, props.user.id) : ''} />}
                label={props.user.name}
                variant="outlined"
              />
            </>
          }
          {
            props.quizzToken &&
            <span
              onClick={() => {
                navigator.clipboard.writeText(props.token)
                props.dispatch(changeAlert({ open: true, msg: 'Token copiado para a área de transferência', class: 'success' }))
              }}
              className='flex mt-5 items-center text-sky-600 rounded-lg cursor-pointer mx-auto'
              variant='h6'
              sx={{ border: 'solid rgb(2,132,199) 1px' }}>
              <IoMdCopy className='mr-2' />
              {props.token}
            </span>
          }
        </Grid>
        <Grid container className='bg-white'>
          <div className='p-2 flex  flex-1'>
            <Button
              className='flex items-center flex-1'
              variant='contained'
              size="small"
              color="secondary"
              onClick={() => props.dispatch(changeConfirm({
                open: true,
                title: 'Você está preparado para iniciar o quizz?',
                msg: props.description ? props.description : 'Boa Sorte no seu quizz!',
                confirmAction: () => props.dispatch(show(props.token)).then(() => {
                  props.dispatch(changeConfirm({ open: false }))
                })
              }))}
            >
              <MdGamepad size={20} />
              <p>Fazer Quizz</p>
            </Button>

            {
              props.showRanking &&
              <Button
                disabled={props.invitation.length <= 0}
                className='flex-1 ml-2'
                onClick={() => setOpen(true)}
                size='small'
                variant='contained'>
                <BiTrophy size={20} />
                <p>Ranking</p>
              </Button>
            }
          </div>
        </Grid>
        {
          props.deleteQuizzButton &&
          <Fab
            color='error'
            className='absolute top-[-10px] right-[-5px] w-[35px] h-[35px]'
            onClick={() => props.dispatch(changeConfirm({
              open: true,
              msg: 'Você tem certeza que deseja deletar este quizz?',
              confirmAction: () => props.dispatch(destroy(props.id))
            }))}
          >
            <HiTrash size={20} />
          </Fab>
        }
      </Grid>
      {
        props.showRanking &&
        <RankingModal
          open={open}
          setOpen={setOpen}
          dialogtitle={props.title}
          ranking={props.invitation}
        />
      }
    </>

  )
}

export default QuizzCard
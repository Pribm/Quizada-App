import React from 'react'

import { HiTrash } from 'react-icons/hi'
import { logo } from 'assets'
import { IoMdCopy } from 'react-icons/io'

import {  Typography, Button, Grid, Paper, Fab, Chip, Avatar, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { changeConfirm } from 'store/Actions/confirm.action'

import { destroy, restartInvitations } from 'store/Actions/quizz.action'

import { getQuizzThumbnail, getUserThumbnail } from 'utils/getThumbnails'
import { MdGamepad } from 'react-icons/md'
import { changeAlert } from 'store/Actions/alert.action'
import DownloadQuizzSpreadsheet from 'components/buttons/DownloadQuizzSpreadsheet'
import { show } from 'store/Actions/game.action'
import { BiChevronDown, BiTrophy } from 'react-icons/bi'
import RankingModal from 'components/ranking/RankingModal'
import { acceptQuizzInvitation, deleteQuizzInvitations, refuseQuizzInvitation } from 'store/Actions/user.action'
import { FaCog } from 'react-icons/fa'
import { change as changeRules } from 'store/Actions/rules.action'

const QuizzCard = ({ props }) => {

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Grid container component={Paper} className='mb-8 mt-4 text-left  relative'>
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
          {console.log(props)}
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
          {
            (props.showInvitation) &&
            <Button
              disabled={props.invitation.length <= 0}
              className='flex-1 mb-2 mr-2 mt-2'
              onClick={() => props.dispatch(deleteQuizzInvitations(props.token))}
              size='small'
              color='error'
              variant='contained'>
              <p>Desfazer Convites</p>
            </Button>
          }
        </Grid>
        <Grid container className='bg-white'>
        {
          props.showInvitationButtons &&
            <div className='w-[100%] px-2 flex mt-2'>
            <Button fullWidth
                onClick={() => {
                  props.dispatch(acceptQuizzInvitation(props.id))
                }}
                variant='contained'
                size='small'
                >
                Aceitar
            </Button>

            <Button
            fullWidth
                onClick={() => props.dispatch(refuseQuizzInvitation(props.id))}
                variant='contained'
                color='error'
                size='small'
                className='mx-2'>
                Recusar
            </Button>
        </div>
          }
          <div className='p-2 flex  flex-1'>
            {
              (!props.hideMakeQuizzButton) &&
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
            }

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
          {
            (props.showRankingReset) &&
            <Accordion className='w-[100%]'>
              <AccordionSummary
                expandIcon={<BiChevronDown />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Reiniciar Partida</Typography>
              </AccordionSummary>
              <AccordionDetails className='p-2 flex  flex-1'>
                <Button
                  disabled={props.invitation.length <= 0}
                  className='flex-1 mb-2 mr-2'
                  onClick={() => props.dispatch(deleteQuizzInvitations(props.token))}
                  size='small'
                  color='error'
                  variant='contained'>
                  <p>Desfazer Convites</p>
                </Button>
                <Button
                  disabled={props.invitation.length <= 0}
                  className='flex-1 mb-2'
                  onClick={() => props.dispatch(restartInvitations(props.token))}
                  size='small'
                  color='error'
                  variant='contained'>
                  <p>Reiniciar Ranking</p>
                </Button>
              </AccordionDetails>
            </Accordion>
          }

          {
            (props.showInvitation) &&
            <Accordion className='w-[100%]'>
              <AccordionSummary
                expandIcon={<BiChevronDown />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Usuários Convidados</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className='flex text-sm'>
                  <span className='mr-2 text-blue-500'>Convite Aceito</span>
                  <span className='mr-2  text-red-600'>Convite Pendente</span>
                  <span className='mr-2 text-green-600'>Quizz Concluido</span>
                </div>
                <hr />
                <div className='flex  flex-wrap'>
                {
                  props.invitation.map((invit, i) => (
                      
                      <Chip
                      key={'invit_label'+i}
                      color={invit.pivot.invitation_accepted === 1 && 'primary' || invit.pivot.invitation_accepted === 0 && 'error' || invit.pivot.quizz_complete === 1 && 'success'}
                      className='mr-2 mt-2'
                      label={invit.name}
                      avatar={<Avatar src={invit.avatar ? getUserThumbnail(invit.avatar, invit.id) : ''} alt={invit.name}/>}
                      />
                      
                    )
                  )
                }
                </div>
              </AccordionDetails>
            </Accordion>
          }

        </Grid>
        {
          props.deleteQuizzButton &&
          <Fab
            color='error'
            className='absolute top-[10px] right-[10px] w-[35px] h-[35px]'
            onClick={() => props.dispatch(changeConfirm({
              open: true,
              msg: 'Você tem certeza que deseja deletar este quizz?',
              confirmAction: () => props.dispatch(destroy(props.id))
            }))}
          >
            <HiTrash size={20} />
          </Fab>
        }
         {
          props.editQuizzButton &&
          <Fab
            className='absolute top-[60px] right-[10px] w-[35px] h-[35px] bg-slate-400 text-white'
              onClick={() => props.dispatch(changeRules(
                {
                  open: true,
                  cancelState: 'back',
                  rules: {
                    withTime: props.withTime,
                    count_time: props.count_time === 'none' && 0 || props.count_time === 'seconds' && 1 || props.count_time === 'minutes' && 2,
                    time_per_question: props.time_per_question,
                    shuffle_questions: props.shuffle_questions,
                    shuffle_answers: props.shuffle_answers,
                    limitNumQuestions: props.limitNumQuestions,
                    numQuestions: props.numQuestions,
                  }
                })
              )}
          >
            <FaCog size={20} />
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
import React, { memo } from 'react'

import { HiTrash } from 'react-icons/hi'
import { logo } from 'assets'
import { IoMdCopy } from 'react-icons/io'

import { Typography, Button, Grid, Paper, Fab, Chip, Avatar, Accordion, AccordionSummary, AccordionDetails, Popover } from '@mui/material'
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
import { BsExclamationLg, BsGear } from 'react-icons/bs'
import { change as changeRules } from 'store/Actions/rules.action'
import { FaQuestion } from 'react-icons/fa'
import FullScreenDialog from 'components/dialog/FullScreenDialog'
import EditQuizz from 'components/editQuizz/EditQuizz'
import { Container } from '@mui/system'

const QuizzCard = memo(({props}) => {

  const [open, setOpen] = React.useState(false);  
  const [openEditQuizz, setOpenEditQuizz] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [saving, setSaving] = React.useState(false);

  const setChipColor = (invit) => {
    if (invit.pivot.invitation_accepted == 1 && invit.pivot.quizz_complete == 0) {
      return 'primary'
    }
    else if (invit.pivot.invitation_accepted == 0 && invit.pivot.quizz_complete == 0) {
      return 'error'
    }
    if (invit.pivot.invitation_accepted == 1 && invit.pivot.quizz_complete == 1) {
      return 'success'
    }
  }

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
              (props.showRanking) &&
              <Button
                disabled={props.invitation.length <= 0 || !props.invitation.filter(e => e.pivot.quizz_complete == true).length > 0}
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
                  <span className='mr-2 text-green-600'>Quiz Concluido</span>
                </div>
                <hr />
                <div className='flex  flex-wrap'>
                  {
                    props.invitation.map((invit, i) => (

                      <Chip
                        key={'invit_label' + i}
                        color={setChipColor(invit)}
                        className='mr-2 mt-2'
                        label={invit.name}
                        avatar={<Avatar src={invit.avatar ? getUserThumbnail(invit.avatar, invit.id) : ''} alt={invit.name} />}
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
            className='absolute top-[5px] right-[5px] w-[35px] h-[35px]'
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
            className='bg-slate-400 hover:bg-slate-600 absolute top-[5px] right-[45px] w-[35px] h-[35px] text-white'
            onClick={() => {
              props.dispatch(changeRules({ open: true, state: 'edit', quizzToken: props.token }))
            }}
          >
            <BsGear size={20} />
          </Fab>
        }

        {
          props.editQuizzQuestionsButton === true ?
            <Fab
              className='bg-blue-400 hover:bg-blue-600 absolute top-[5px] right-[90px] w-[35px] h-[35px] text-white flex justify-center items-center'
              onClick={() => setOpenEditQuizz(true)} 
            >
              <FaQuestion size={20} />
            </Fab>
            :
            ''
        }

        {
          props.showQuizzInfoButton === true ?
            <>
              <Fab
                className='bg-yellow-400 hover:bg-yellow-600 absolute top-[5px] right-[135px] w-[35px] h-[35px] text-white flex justify-center items-center'
                onClick={e => setAnchorEl(e.currentTarget)} 
              >
                <BsExclamationLg size={20} />
              </Fab>
              <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              >
                <ul className='p-4'>
                  <li>
                    Quiz com limite: {props.limit_questions > 0 ? 'Sim' : 'Não'}
                  </li>
                  <li>
                    Quiz com Tempo: {props.withTime == 0 ? 'Não' : 'Sim'}
                  </li>
                  <li>
                    Mostrar resposta ao responder: {props.immediate_show_wrong_answers == 0 ? 'Não' : 'Sim'}
                  </li>
                  <li>
                    Embaralhar Perguntas: {props.shuffle_questions == 0 ? 'Não' : 'Sim'}
                  </li>
                  <li>
                    Embaralhar Respostas: {props.shuffle_answers == 0 ? 'Não' : 'Sim'}
                  </li>
                  <li>
                    Limite / Total: {props.limit_questions} / {props.questions_count}
                  </li>
                </ul>
              </Popover>
            </>
            :
            ''
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

      {
        props.editQuizzQuestionsButton &&
        <FullScreenDialog
          title={'Editar Perguntas do Quizz'}
          open={openEditQuizz}
          setOpen={setOpenEditQuizz}
          handleSave={() => setSaving(true)}
        >

          <Container className='h-[calc(100vh-55px)] pt-[15px]'>
            <div className='h-[100%]'>
              <Typography className='mb-5'>
                {props.title}
              </Typography>
              <EditQuizz
              saving={saving}
              setSaving={setSaving}
              setOpenEditQuizz={setOpenEditQuizz}
              rules={{
                  title: props.title,
                  category_id: props.category.id,
                  withTime: props.withTime,
                  time_per_question: props.time_per_question,
                  immediate_show_wrong_answers: props.immediate_show_wrong_answers,
                  shuffle_answers: props.shuffle_answers,
                  shuffle_questions: props.shuffle_questions,
                  limitNumQuestions: props.limit_questions > 0 ? true : false,
                  limit_questions: props.limit_questions
                 }} 
              token={props.token}
              id={props.id}
              />
            </div>
          </Container>
        </FullScreenDialog>
      }
    </>

  )
}) 

export default QuizzCard
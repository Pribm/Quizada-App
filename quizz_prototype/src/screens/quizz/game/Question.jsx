import React, { useEffect, useRef, useState } from 'react'

import { motion, useAnimation } from 'framer-motion'

import Lottie from 'lottie-react'
import { AwardMedal, correctAnswer, QuizzPlaceHolder1, wrongAnswer } from 'assets'

import { AiOutlineCloseCircle } from 'react-icons/ai'

import { useNavigate } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { changeConfirm } from 'store/Actions/confirm.action'

import { getQuestionThumbnail } from 'utils/getThumbnails'

import Timer from 'components/timer/Timer'
import { change } from 'store/Actions/game.action'
import { Button, Dialog } from '@mui/material'

const Question = ({ handleAnswer }) => {

  const dispatch = useDispatch();

  const { quizz: { time_per_question, user_id, withTime, currentQuestion, count_time, immediate_show_wrong_answers, answer }, questions } = useSelector(state => state.gameReducer)
  const { user } = useSelector(state => state.userReducer)
  const { remainingTime } = useSelector(state => state.timerReducer)

  const answersContainer = useRef(null)
  const [showQuestionResult, setShowQuestionResult] = useState({
    open: false,
    correct: false
  })

  const controls = useAnimation()
  const navigate = useNavigate()

  useEffect(() => {
    return () => dispatch(changeConfirm({ open: false, confirmAction: () => navigate('/home', { replace: true }) }))
  }, [])

  useEffect(() => {
    if (remainingTime === 0) {
      handleAnswer()
    }
  }, [remainingTime])

  const showInstantWrong = () => {
    let elements = answersContainer.current.children

    for (let element of elements) {
      if (element.innerText !== questions[currentQuestion].correct_answer) {
        element.classList.remove('bg-gradient-to-t')
        element.classList.add('bg-red-500')
        element.classList.add('text-white')
      } else {

        element.classList.remove('bg-gradient-to-t')
        element.classList.add('bg-green-500')
        element.classList.add('text-white')
      }
    }

    if (questions[currentQuestion].correct_answer === answer) {
      setShowQuestionResult({
        open: true,
        correct: true
      })
    }else{
      setShowQuestionResult({
        open: true,
        correct: false
      })
    } 
  }

  const clearButtons = () => {
    let elements = answersContainer.current.children
    for (let element of elements) {
      if (element.innerText !== questions[currentQuestion].correct_answer) {
        element.classList.add('bg-gradient-to-t')
        element.classList.remove('bg-red-500')
        element.classList.remove('text-white')
      } else {
        element.classList.add('bg-gradient-to-t')
        element.classList.remove('bg-green-500')
        element.classList.remove('text-white')
      }
    }
  }

  return (
    <>
      <motion.div
        animate={controls}
        className='bg-gradient-to-b from-blue-500 to-sky-500'
      >

        <div className='min-h-screen w-[100vw] flex flex-col  md:flex-row md:justify-center md:items-center relative md:container md:mx-auto'>
          <div className='fixed h-[40px] z-10 flex justify-between items-center w-[100%] top-0 pt-6 text-white px-4'>
            <AiOutlineCloseCircle size={40} className='cursor-pointer'
              onClick={() => {
                dispatch(changeConfirm({
                  open: true,
                  title: 'Você deseja desistir?',
                  msg: 'Você quer parar por aqui? Todo o seu progresso e pontos ganhados neste quizz serão perdidos',
                  confirmAction: () => {
                    dispatch(change({ quizzComplete: true, answer: '' }))
                  }
                }))
              }
              } />
            <div className='h-[40px] ml-12 md:ml-0'>

              {withTime ? <Timer
                initialTime={count_time !== "minutes" ? time_per_question : time_per_question * 60}
                timerText={count_time !== "minutes" ? "Tempo Por questão" : "Tempo total do quizz"}
              /> : ''}
            </div>
          </div>

          <div className='mt-auto md:mt-0 md:mr-6 md:flex flex-col-reverse px-4 md:w-[50%] md:items-center'>
            <div className='h-[40px]' />
            {
              questions[currentQuestion].image ?
                <div className='flex justify-center h-[240px] mb-5'>
                  <img src={getQuestionThumbnail(questions[currentQuestion].image, user_id, 240, 240)} alt="imagem_quizz" className='h-[100%] object-cover' />
                </div>
                :
                <Lottie animationData={QuizzPlaceHolder1} className='h-[250px] md:h-[300px]' />
            }
            <div className='text-[1.2rem] leading-[1.2rem] md:leading-normal text-white'>
              <span>Pergunta </span><span>{currentQuestion + 1}</span><span> de {questions.length}</span>
            </div>

            <div className='text-[2rem] leading-[2rem] md:leading-normal text-white mb-4 md:mb-0'>
              <h4>{questions[currentQuestion].question}</h4>
            </div>
          </div>

          <div className='md:w-[30%]'>
            <div className='flex flex-col px-4 md:w-[100%]' ref={answersContainer}>
              {questions[currentQuestion].answers.map((answer, index) => (
                <button
                  key={'answer' + index} onClick={() => dispatch(change({ answer: answer }))}
                  className='p-3 bg-gradient-to-t from-slate-100 to-white rounded-lg shadow-md flex-1 md:flex-initial my-1 text-sky-500 text-[1.2rem] focus:bg-gradient-to-b focus:from-lime-500 focus:to-lime-600 focus:text-white'
                >
                  {answer}
                </button>
              ))}
            </div>
            <div className='mb-8 mt-4 text-center'>
              <button
                className='bg-orange-500 px-4 py-2 rounded-lg text-white shadow-md'
                onClick={() => {
                  if (!Boolean(immediate_show_wrong_answers)) {
                    handleAnswer()
                  } else {
                    showInstantWrong()
                  }
                }}>
                Responder
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      <Dialog open={showQuestionResult.open} PaperComponent={'div'} PaperProps={{ className: 'flex flex-col items-center' }}>
        {
          showQuestionResult.correct ?
            <>
              <Lottie animationData={correctAnswer} loop={false} />
              <div className='bg-white p-4 rounded-md text-center text-green-500'>
                <h3 className='text-4xl'>Parabéns!</h3>
                <h4 className='bg-white text-xl rounded-md text-center text-green-700'>Questão Correta!</h4>
                <Button
                  onClick={() => {
                    handleAnswer()
                    setShowQuestionResult({ open: false })
                    clearButtons()

                  }}
                  variant='contained'
                  color={'success'}
                  className='mt-2'
                >
                  Próxima questão
                </Button>
              </div>
            </>
            :
            <>
              <Lottie animationData={wrongAnswer} loop={false} />
              <div className='bg-white p-4 rounded-md text-center text-red-500'>
                <h3 className='text-4xl'>Que pena, Você errou!</h3>
                <h4 className='bg-white text-xl rounded-md text-center text-red-600'>
                  você respondeu - {answer}
                </h4>
                <h4 className='bg-white text-xl rounded-md text-center text-green-500'>
                  Pergunta: {questions[currentQuestion].question}
                </h4>
                <h4 className='bg-white text-xl rounded-md text-center text-green-600'>
                  Resposta Correta - {questions[currentQuestion].correct_answer}
                </h4>
                <Button
                  onClick={() => {
                    handleAnswer()
                    setShowQuestionResult({ open: false })
                    clearButtons()

                  }}
                  variant='contained'
                  color={'error'}
                  className='mt-2'
                >
                  Próxima questão
                </Button>
              </div>
            </>
        }
      </Dialog>
    </>
  )
}

export default Question
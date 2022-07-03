import React, { useEffect } from 'react'

import { motion, useAnimation } from 'framer-motion'

import Lottie from 'lottie-react'
import { AwardMedal, QuizzPlaceHolder1 } from 'assets'
import { Confirm } from 'components/confirm/Confirm'

import {AiOutlineCloseCircle} from 'react-icons/ai'

import { useNavigate } from 'react-router-dom'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import {useSelector, useDispatch} from 'react-redux'
import { change } from 'store/Actions/confirm.action'
import { CircularProgress } from '@mui/material'

const TimerComponent = ({questionTime}) => (
  <CountdownCircleTimer
    isPlaying
    duration={questionTime}
    colors={['#00ff00', '#F7B801', '#A30000', '#A30000']}
    colorsTime={[7, 5, 2, 0]}
    size={80}
    strokeWidth={5}
    initialRemainingTime={questionTime}
  >
    {({ remainingTime }) => remainingTime}
  </CountdownCircleTimer>
)


const Question = ({ currentQuestion, questions, setAnswer, handleAnswer, isLoading }) => {

  const dispatch = useDispatch();

  const quizState = useSelector(state => state.quizzReducer)
  const controls = useAnimation()

  const navigate = useNavigate()

  useEffect(() => {

    return () => dispatch(change({open: false}))
  }, [])

  return (
    <>
      <Confirm confirmAction={() => navigate('/home', {replace: true})}/>
      <motion.div
        animate={controls}
        className='bg-gradient-to-b from-blue-500 to-sky-500'
        >
        <div className='min-h-screen w-[100vw] flex flex-col  md:flex-row md:justify-center md:items-center relative md:container md:mx-auto'>
          <div className='fixed flex justify-between items-center w-[100%] top-0 pt-6 text-white px-4'>
            <AiOutlineCloseCircle size={40} className='cursor-pointer'
            onClick={() => {
              dispatch(change({open: true, msg: 'Você quer parar por aqui? Todo o seu progresso e pontos ganhados neste quizz serão perdidos'}))}
            }/>
            <div className='h-[40px] ml-12 md:ml-0'>
              <TimerComponent questionTime={quizState.questionTime}/>
            </div>
            <div className='flex items-center rounded-full bg-white text-blue-500'>
              <Lottie animationData={AwardMedal} initialSegment={[40,100]} className='h-[40px]'/>
              <span className='mr-2'>30º Lugar</span>
            </div>
          </div>

          
          <div className='mt-auto md:mt-0 md:mr-6 md:flex flex-col-reverse px-4 md:w-[50%] md:items-center'>
            <Lottie animationData={QuizzPlaceHolder1} className='h-[300px] md:h-[300px]'/>
            <div className='text-[1.2rem] leading-[1.2rem] md:leading-normal text-white'>
              <span>Question </span><span>{currentQuestion + 1}</span><span> of 10</span>
            </div>

            <div className='text-[2rem] leading-[2rem] md:leading-normal text-white mb-4 md:mb-0'>
              <h4>{questions[currentQuestion].question}</h4>
            </div>
          </div>

          <div className='flex flex-col px-4 md:w-[50%]'>
            {
              !isLoading ?
              questions[currentQuestion].answers.map((answer, index) => (
                <motion.button
                  key={'answer' + index} onClick={() => setAnswer(answer)}
                  className='p-3 bg-gradient-to-t from-slate-100 to-white rounded-lg shadow-md flex-1 md:flex-initial my-1 text-sky-500 text-[1.2rem] focus:bg-gradient-to-b focus:from-lime-500 focus:to-lime-600 focus:text-white'
                  >
                  {answer}
                </motion.button>
              ))
              :
              <div className='min-h-[300px] flex justify-center items-center'>
                <CircularProgress/>
              </div>
            }

            <div className='mb-8 mt-4 text-center'>
              <button className='bg-orange-500 px-4 py-2 rounded-lg text-white shadow-md' onClick={() => handleAnswer()}>Answer</button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Question
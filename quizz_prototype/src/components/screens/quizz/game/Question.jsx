import React, { useEffect } from 'react'

import { motion, useAnimation } from 'framer-motion'

import Lottie from 'lottie-react'
import { AwardMedal, QuizzPlaceHolder1 } from 'assets'

import {AiOutlineCloseCircle} from 'react-icons/ai'

import { useNavigate } from 'react-router-dom'

import {useSelector, useDispatch} from 'react-redux'
import { changeConfirm } from 'store/Actions/confirm.action'

import { getQuestionThumbnail } from 'utils/getThumbnails'

import Timer from 'components/timer/Timer'
import { change } from 'store/Actions/game.action'

const Question = ({handleAnswer }) => {

  const dispatch = useDispatch();


  const {quizz: {time_per_question, user_id, withTime, currentQuestion, count_time}, questions} = useSelector(state => state.gameReducer)
  const {user} = useSelector(state => state.userReducer)
  const {remainingTime} = useSelector(state => state.timerReducer)

  const controls = useAnimation()
  const navigate = useNavigate()

  useEffect(() => {
    return () => dispatch(changeConfirm({open: false, confirmAction: () => navigate('/home', {replace: true})}))
  }, [])

  useEffect(() => {
    if(remainingTime === 0){
      handleAnswer()
    }
  }, [remainingTime])

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
                msg: 'Você quer parar por aqui? Todo o seu progresso e pontos ganhados neste quizz serão perdidos',
                confirmAction: () => navigate('/home', {replace: true})
              }))}
            }/>
            <div className='h-[40px] ml-12 md:ml-0'>

            {withTime ? <Timer
            initialTime={count_time !== "minutes" ? time_per_question : time_per_question*60}
            timerText={count_time !== "minutes" ? "Tempo Por questão" : "Tempo total do quizz"}
            /> : ''}
            </div>
            <div className='flex items-center rounded-full bg-white text-blue-500'>
              <Lottie animationData={AwardMedal} initialSegment={[40,100]} className='h-[40px]'/>
              <span className='mr-2'>{user.Ranking}º Lugar</span>
            </div>
          </div>
          
          <div className='mt-auto md:mt-0 md:mr-6 md:flex flex-col-reverse px-4 md:w-[50%] md:items-center'>
            <div className='h-[40px]'/>
              {
                questions[currentQuestion].image ?
                <div className='flex justify-center h-[240px] mb-5'>
                  <img src={getQuestionThumbnail(questions[currentQuestion].image, user_id, 240, 240)} alt="imagem_quizz" className='h-[100%] object-cover'/>
                </div>
                :
                <Lottie animationData={QuizzPlaceHolder1} className='h-[250px] md:h-[300px]'/>
              }
              <div className='text-[1.2rem] leading-[1.2rem] md:leading-normal text-white'>
                <span>Pergunta </span><span>{currentQuestion + 1}</span><span> de {questions.length}</span>
              </div>

              <div className='text-[2rem] leading-[2rem] md:leading-normal text-white mb-4 md:mb-0'>
                <h4>{questions[currentQuestion].question}</h4>
              </div>
          </div>

          <div className='flex flex-col px-4 md:w-[50%]'>
              {questions[currentQuestion].answers.map((answer, index) => (
                <motion.button
                  key={'answer' + index} onClick={() => dispatch(change({answer: answer}))}
                  className='p-3 bg-gradient-to-t from-slate-100 to-white rounded-lg shadow-md flex-1 md:flex-initial my-1 text-sky-500 text-[1.2rem] focus:bg-gradient-to-b focus:from-lime-500 focus:to-lime-600 focus:text-white'
                  >
                  {answer}
                </motion.button>
              ))}
            <div className='mb-8 mt-4 text-center'>
              <button className='bg-orange-500 px-4 py-2 rounded-lg text-white shadow-md' onClick={() => handleAnswer()}>Responder</button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Question
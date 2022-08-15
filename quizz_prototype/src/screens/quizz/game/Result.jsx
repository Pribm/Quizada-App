import React from 'react'
import Lottie from 'lottie-react'

import trophy from 'assets/trophy.json'
import fiveStars from 'assets/five-stars.json'
import failure from 'assets/sad-tear.json'
import { VscDebugRestart } from 'react-icons/vsc'

import { useDispatch, useSelector } from 'react-redux'

import AnswersTable from './AnswersTable'

import { change, finishGame, restartGame } from 'store/Actions/game.action'
import { Button } from '@mui/material'
import { IoMdHome } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const Result = ({ totalQuestions }) => {

    const {quizz, quizz: {withTime}, correctAnswers} = useSelector(state => state.gameReducer)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    let totalStars = Math.ceil(((correctAnswers.length * 5) / totalQuestions))
    let totalStarFrames = (correctAnswers.length !== 0) ? Math.ceil(((correctAnswers.length * 5) / totalQuestions)) * 15 : 15

    React.useEffect(() => {
        let score = 0;

        if(withTime){
            score = correctAnswers.reduce((prev,curr) => prev+curr.score,0)

        }else{
            score = JSON.parse(JSON.stringify(correctAnswers)).reduce((prev,curr) => prev+curr.score,0)
        }
        dispatch(
            finishGame(
                {token: quizz?.token,
                score: score
            }))
    }, [])

    return (
        <div className='bg-gradient-to-b from-blue-500 to-sky-500'>
            <div className='min-h-screen w-[100vw] flex flex-col md:justify-center justify-center md:items-center'>
                <div className='flex flex-col  md:flex-row relative md:container md:mx-auto md:w-[50vw] mt-auto'>
                    <div className='h-[50vh] relative flex justify-center flex-col items-center md:w-[50%] md:h-[500px]'>
                        {
                            totalStars > 3 ?
                                <div className='text-center flex-1 relative'>
                                    <h1 className='text-white font-logo text-2xl absolute top-5 right-[50%] translate-x-[50%] md:relative md:text-4xl md:w-[300px] md:ml-auto'>
                                        Parabéns,
                                        {totalStars === 4 && 'Você ficou acima da média!'}
                                        {totalStars === 5 && 'Você foi muito bem!!!'}
                                    </h1>
                                    <Lottie animationData={trophy} className='w-[auto] md:w-[450px]' loop={false} />
                                </div>
                                :
                                <>
                                    <h1 className='font-bold text-3xl text-center text-white'>Que pena, voê pode fazer melhor da próxima vez!</h1>
                                    <Lottie animationData={failure} className='w-[50%]' loop={true} />
                                </>
                        }
                        <Lottie animationData={fiveStars} className='h-[60px] absolute bottom-5' initialSegment={[0, totalStarFrames]} loop={false} />
                    </div>
                    <div className='rounded-[25px 25px 0 0] bg-white flex-1 rounded-t-3xl p-4 flex flex-col justify-center items-center md:h-[500px] md:rounded-xl'>
                        <h1 className='text-3xl text-sky-500'>Resultado:</h1>
                        <h2 className='text-xl text-orange-500 mb-auto'>{correctAnswers.length} respostas corretas</h2>
                        <div className='mb-auto'>
                            <div onClick={() => dispatch(restartGame())} className='flex flex-col justify-center items-center cursor-pointer'>
                                <VscDebugRestart className='text-white bg-gradient-to-b from-blue-500 to-sky-400 p-[1.2rem] rounded-full h-[6rem] w-[6rem]' />
                                <h5 className='text-sky-500'>Jogar Outro Quizz</h5>
                            </div>
                        </div>

                        <Button
                            onClick={() => {
                                dispatch(change("clear"))
                                navigate('/home', {replace: true})
                            }}

                        >
                            <IoMdHome className='mr-2' />
                            Voltar à tela principal
                        </Button>
                    </div>
                </div>
                <div className='bg-white md:mb-auto md:mt-4 flex-1 md:flex-grow-0'>
                    <AnswersTable/>
                </div>
            </div>
        </div>
    )
}

export default Result
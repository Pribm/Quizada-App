import React from 'react'
import Lottie from 'lottie-react'

import trophy from 'assets/trophy.json'
import fiveStars from 'assets/five-stars.json'
import failure from 'assets/sad-tear.json'
import { VscDebugRestart } from 'react-icons/vsc'
import { IoMdBook, IoMdHome } from 'react-icons/io'
import { Link } from 'react-router-dom'







const Result = ({ restart, correctAnswers, setViewAnswers, viewAnswers }) => {

    let totalStars = Math.ceil(((correctAnswers.length * 5) / 10))
    let totalStarFrames = (correctAnswers.length !== 0) ? Math.ceil(((correctAnswers.length * 5) / 10)) * 15 : 15

    return (
        <div className='bg-gradient-to-b from-blue-500 to-sky-500'>
            <div className='min-h-screen w-[100vw] flex flex-col  md:flex-row md:justify-center md:items-center relative md:container md:mx-auto md:w-[50vw]'>
                <div className='h-[50%] relative flex justify-center flex-col items-center md:w-[50%] md:h-[500px]'>
                    {
                        totalStars > 3 ?
                            <div className='text-center flex-1 relative'>
                                <h1 className='text-white font-logo text-2xl absolute top-5 right-[50%] translate-x-[50%] md:relative md:text-4xl md:w-[300px] md:ml-auto'>Parabéns, Você ficou acima da média!</h1>
                                <Lottie  animationData={trophy} className='w-[auto] md:w-[450px]' loop={false} />
                            </div>
                            :
                            <>
                                <h1>Que pena, voê pode fazer melhor da próxima vez!</h1>
                                <Lottie animationData={failure} height='50%' loop={true} />
                            </>
                    }
                    <Lottie animationData={fiveStars} className='h-[60px] absolute bottom-5' stopFrame={totalStarFrames || 15} loop={false} />
                </div>
                <div className='rounded-[25px 25px 0 0] bg-white flex-1 rounded-t-3xl p-4 flex flex-col justify-center items-center md:h-[500px] md:rounded-xl'>
                    <h1 className='text-3xl text-sky-500'>Results:</h1>
                    <h2 className='text-xl text-orange-500 mb-auto'>{correctAnswers.length} respostas corretas</h2>
                    <div className='mb-auto'>
                        <div onClick={restart} className='flex flex-col justify-center items-center'>
                            <VscDebugRestart className='text-white bg-gradient-to-b from-blue-500 to-sky-400 p-[1.2rem] rounded-full h-[6rem] w-[6rem]'/>
                            <h5 className='text-sky-500'>Jogar Novamente</h5>
                        </div>
                    </div>
                    <div onClick={() => setViewAnswers(!viewAnswers)} className='flex mb-4 items-center w-[250px] justify-center text-sky-500 py-2 px-4 rounded-lg' style={{border: 'solid #3b82f6 1px'}}>
                        <IoMdBook className='mr-2'/>
                        {!viewAnswers ? "Ver" : "Esconder"} suas respostas
                    </div>
                    <Link
                    className='flex items-center justify-center text-orange-500 mb-4 py-2 px-4 rounded-lg w-[250px]' style={{border: 'solid #f6833b 1px'}}
                    to='/home'
                    >
                    <IoMdHome className='mr-2'/>
                    Voltar ao Menu principal
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Result
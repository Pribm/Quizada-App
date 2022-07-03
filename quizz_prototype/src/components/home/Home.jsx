import React from 'react'

import { PlayAlone, BackGroundMenuCard, Battle, Endurance, Tournment } from '../../assets'
import Lottie from 'lottie-react'
import MenuWrapper from '../wrappers/MenuWrapper'

import {useDispatch} from 'react-redux'
import { change } from '../../store/Actions/quizz.action'

import {useNavigate} from 'react-router-dom'

const Home = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const cards = [
        {
            title: 'Desafio',
            subtitle: 'Jogue Sozinho',
            image: PlayAlone,
            quizz: {
                gameMode: 'single',
                quizzCategory: 'geral',
                numQuestions: 10,
                questionTime: 60,
                dificulty: 'normal'
            }
        },
        {
            title: 'Duelo',
            subtitle: 'Jogue contra um amigo',
            image: Battle,
            loop: false,
        },
        {
            title: 'Torneio',
            subtitle: 'Jogue contra outras Pessoas',
            image: Tournment
        },
        {
            title: 'Resistência',
            subtitle: 'Mais perguntas em menos tempo',
            image: Endurance,
            loop: true
        },
    ]


    return (
        <div className='p-4 md:text-center'>
            <h1 className='text-white logo-font md:text-[3rem] text-center md:bg-transparent bg-blue-800 rounded-xl py-4'>Escolha seu modo de Jogo</h1>
            <div className="flex justify-center md:justify-center flex-wrap relative my-5">
                {
                    cards.map((card, i) => (
                        <div
                            key={'card_' + i}
                            onClick={() => {
                                dispatch(change(card.quizz))
                                navigate('/quizz', {replace: true})
                            }}
                            className={`
                                    relative
                                    my-4
                                    mx-4
                                    min-w-[150px]
                                    max-w-[240px]
                                    md:top-0
                                    rounded-xl
                                    flex
                                    flex-col
                                    bg-white
                                    p-4
                                    overflow-hidden
                                    shadow-md
                                    md:mr-8
                                    cursor-pointer
                                    hover:scale-125
                                    transition-transform
                                    ease-in
                                    `}>
                            <h2 className='z-10'>{card.title}</h2>
                            <h3 className='z-10 bg-blue-400 rounded-md p-2 text-white'>{card.subtitle}</h3>
                            <Lottie loop={card.loop} animationData={card.image} className='z-10 mt-auto mb-auto' />
                            <Lottie animationData={BackGroundMenuCard} className='z-0 w-[140%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] absolute' />
                        </div>
                    )
                    )
                }
            </div>
        </div>
    )
}

export default MenuWrapper(Home)
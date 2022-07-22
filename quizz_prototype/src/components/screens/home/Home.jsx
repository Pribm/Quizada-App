import React from 'react'

import { PlayAlone, BackGroundMenuCard, Battle, Endurance, Tournment } from '../../../assets'
import Lottie from 'lottie-react'
import MenuWrapper from '../../wrappers/MenuWrapper'

import { useDispatch, useSelector } from 'react-redux'
import { change } from '../../../store/Actions/quizz.action'

import { useNavigate } from 'react-router-dom'
import FriendsList from 'components/friendsList/FriendsList'
import { Grid, Paper } from '@mui/material'
import { useEffect } from 'react'
import { index } from 'store/Actions/friends.action'

const Home = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {friendsList: {current_page}, friendsList} = useSelector(state => state.friendsReducer)

    const cards = [
        {
            title: 'Desafio',
            subtitle: 'Jogue Sozinho',
            image: PlayAlone,
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

    useEffect(() => {
        dispatch(index({showUnfollowedUsers: true}, false))
    }, [])

    const handleLoadMore = () => {
        dispatch(index({showUnfollowedUsers: true, page: current_page+1}, true))
    }

    return (
        <div className='flex justify-center h-[100%]  my-auto'>
            <div className='flex flex-col container md:px-8 h-[100%]  my-auto'>
                <h1 className='text-white logo-font md:text-[2rem] text-center md:bg-transparent mb-4 bg-blue-800 rounded-xl py-4 mx-4'>Escolha seu modo de Jogo</h1>
                <Grid container spacing={2} className='md:h-[60vh] '>
                    <Grid item xs={12} md={8} className='flex flex-col h-[100%]'>
                        <div className='flex justify-between overflow-scroll h-[50%] ml-4 md:m-0 mb-4 hideVerticalScroll pb-4'>
                        {
                            cards.map((card, i) => (
                                <div
                                    key={'card_' + i}
                                    onClick={() => {
                                        dispatch(change(card.quizz))
                                        navigate('/quizz', { replace: true })
                                    }}
                                    className={`
                                    relative
                                    md:max-w-[180px]
                                    md:min-w-[180px]
                                    min-h-[100%]
                                    min-w-[180px]
                                    md:top-0
                                    mr-4
                                    rounded-xl
                                    flex
                                    flex-col
                                    bg-white
                                    p-4
                                    overflow-hidden
                                    shadow-md
                                    cursor-pointer
                                    hover:scale-105
                                    transition-transform
                                    ease-in
                                    `}>
                                    <h2 className='z-10'>{card.title}</h2>
                                    <h3 className='z-10 bg-blue-400 rounded-md p-2 text-white'>{card.subtitle}</h3>
                                    <Lottie loop={card.loop} animationData={card.image} size={100} className='z-10 mt-auto mb-auto w-[100%]' />
                                    <Lottie animationData={BackGroundMenuCard} className='z-0 w-[140%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] absolute' />
                                </div>
                            )
                            )
                        }
                        </div>
                        <Paper className='md:mr-4 md:ml-0 mx-4 max-h-[50%] overflow-y-scroll hideScroll'>
                            Convites de quizz
                            <div>
                                wegrgg
                            </div>
                            <div>
                                wefwefewf
                            </div>
                            <div>
                                wegrgg
                            </div>
                            <div>
                                wefwefewf
                            </div>
                            <div>
                                wegrgg
                            </div>
                            <div>
                                wefwefewf
                            </div>
                            <div>
                                wegrgg
                            </div>
                            <div>
                                wefwefewf
                            </div>
                            <div>
                                wegrgg
                            </div>
                            <div>
                                wefwefewf
                            </div>
                            <div>
                                wefwefewf
                            </div>
                            <div>
                                wefwefewf
                            </div>
                            <div>
                                wefwefewf
                            </div>
                            <div>
                                wefwefewf
                            </div>
                            <div>
                                wefwefewf
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} className='md:h-[100%] '>
                        <FriendsList handleLoadMore={handleLoadMore} friendsList={friendsList} className={' mb-[55px] md:min-h-[100%]'}/>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default MenuWrapper(Home)
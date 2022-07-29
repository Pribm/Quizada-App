import React, { useState } from 'react'

import { BackGroundMenuCard } from '../../../assets'
import Lottie from 'lottie-react'
import MenuWrapper from '../../wrappers/MenuWrapper'

import { useDispatch, useSelector } from 'react-redux'
import { change } from '../../../store/Actions/quizz.action'

import { useNavigate } from 'react-router-dom'

import { Avatar, Button, Card, CircularProgress, Grid, Paper } from '@mui/material'
import { useEffect } from 'react'
import { addFriend, index } from 'store/Actions/friends.action'

import { cards } from 'components/navigation/links'
import { getQuizzInvitations } from 'store/Actions/user.action'

import HorizontalQuizzCard from 'components/quizzCard/HorizontalQuizzCard'
import InfiniteScroll from 'components/infiniteScroll/InfiniteScroll'
import { RiUserFollowFill } from 'react-icons/ri'
import { HiUserAdd } from 'react-icons/hi'
import { FcConferenceCall, FcFolder } from 'react-icons/fc'
import { SearchBox } from 'components/searchBox/SearchBox'
import { changeLoading } from 'store/Actions/loading.action'

const Home = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { friendsList: { current_page }, friendsList } = useSelector(state => state.friendsReducer)
    const { quizzInvitations } = useSelector(state => state.userReducer)
    const { quizz: { quizzCreated } } = useSelector(state => state.gameReducer)

    const [loadingFriend, setLoadingFriend] = useState(true)
    const [friendSearch, setFriendSearch] = useState('')

    useEffect(() => {
        dispatch(index({ showUnfollowedUsers: true }, false)).then(() => setLoadingFriend(false))
        dispatch(getQuizzInvitations({}, false))
    }, [])

    useEffect(() => {
        if (quizzCreated) {
            navigate('/quizz', { replace: true })
        }
    }, [quizzCreated])

    const handleLoadMore = () => {
        dispatch(index({ showUnfollowedUsers: true, page: current_page + 1 }, true))
    }

    const handleLoadMoreQuizzSolicitations = () => {
        dispatch(getQuizzInvitations({ page: quizzInvitations.current_page + 1 }, true))
    }

    const handlesearching = () => {
        dispatch(changeLoading({ open: true, text: 'Procurando Usuário...' }))
        dispatch(index({ showUnfollowedUsers: true, search: friendSearch }, false)).then(() => dispatch(changeLoading({ open: false})))
    }

    return (
        <div className='flex justify-center h-[100%]  my-auto'>
            <div className='flex flex-col container md:px-8 h-[100%]  my-auto'>
                <h1 className='text-white logo-font md:text-[2rem] text-center md:bg-transparent mb-4 bg-blue-800 rounded-xl py-4 mx-4'>Escolha seu modo de Jogo</h1>
                <Grid container spacing={2} className='md:h-[60vh] '>
                    <Grid item xs={12} md={8} className='flex flex-col h-[100%]'>
                        <div className='flex justify-between overflow-scroll min-h-[210px] h-[50%] ml-4 md:m-0 mb-4 hideVerticalScroll pb-4'>
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
                                    max-w-[180px]
                                    min-h-[100%]
                                    min-w-[180px]
                                    md:min-w-[280px]
                                    md:w-[280px]
                                    md:flex-row
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
                                        <div className="flex flex-col">
                                            <h2 className='z-10'>{card.title}</h2>
                                            <h3 className='z-10 bg-blue-400 rounded-md p-2 text-white'>{card.subtitle}</h3>
                                        </div>
                                        <Lottie loop={card.loop} animationData={card.image} size={100} className='z-10 mt-auto mb-auto w-[100%]' />
                                        <Lottie animationData={BackGroundMenuCard} className='z-0 w-[140%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] absolute' />
                                    </div>
                                )
                                )
                            }
                        </div>
                        <div className='md:pr-4 md:pt-4 h-[450px]'>
                            <InfiniteScroll
                                className='h-[100%] overflow-y-scroll hideScroll'
                                handleLoadMore={handleLoadMoreQuizzSolicitations}
                                title='Quizzes Pendentes'
                                current_page={quizzInvitations.current_page}
                                last_page={quizzInvitations.last_page}
                            >
                                {
                                    quizzInvitations.data.length > 0 ?
                                        quizzInvitations.data.map((quizz, i) => (
                                            <React.Fragment key={'quizz_solicitation' + i}>
                                                <HorizontalQuizzCard props={{ ...quizz, dispatch }} />
                                            </React.Fragment>
                                        ))
                                        :
                                        <Paper className='flex flex-col items-center p-4 w-[100%]'>
                                            <FcFolder size={100} />
                                            <h1 className='text-center'>Você não possui nenhum quizz pendende, gostaria de criar um e enviar à um amigo?</h1>
                                            <Button
                                                onClick={() => navigate('/quizz/create', { replace: true })}
                                                variant='contained'
                                                className='mt-2'>
                                                Sim, por favor!
                                            </Button>
                                        </Paper>
                                }
                            </InfiniteScroll>
                        </div>
                    </Grid>

                    <Grid item xs={12} md={4} className='md:h-[100%] '>
                        <InfiniteScroll
                            handleLoadMore={handleLoadMore}
                            className={' mb-[55px] md:min-h-[100%]'}
                            title='Adicionar Amigos'
                            current_page={friendsList.current_page}
                            last_page={friendsList.last_page}
                        >
                            <div className='bg-blue-500 p-4 sticky top-[55px] z-10'>
                                <SearchBox
                                className='pl-8'
                                value={friendSearch}
                                onChange={e => setFriendSearch(e.target.value)}
                                searchHandler={handlesearching}
                                />
                            </div>
                            
                            {
                                <div className='p-4'>
                                    {
                                        friendsList.data.length > 0  ?
                                        friendsList?.data.map((friend, i) => (
                                            <Card className='flex min-h-[100px] items-center p-4 mb-4' key={'home_screen_friend_' + i}>
                                                <div>
                                                    <Avatar src={friend.avatar} alt={friend.name}>
                                                        {friend.name[0]}
                                                    </Avatar>
                                                </div>
        
                                                <div className='ml-4 mr-auto'>
                                                    <h3>
                                                        {
                                                            friend.name
                                                        }
                                                    </h3>
                                                    <h4>
                                                        {
                                                            friend.email
                                                        }
                                                    </h4>
                                                </div>
                                                <Button onClick={() => dispatch(addFriend(friend.id))}>
                                                    {
                                                        ("pivot" in friend) ?
                                                            <div className='text-sky-500 flex flex-col items-center '>
                                                                <RiUserFollowFill size={25} />
                                                                <h5 className='text-[.5rem]'>Solicitação enviada</h5>
                                                            </div>
                                                            :
                                                            <div className='text-slate-500 flex flex-col items-center '>
                                                                <HiUserAdd size={30} />
                                                                <h5 className='text-[.5rem]'>Enviar Solicitação</h5>
                                                            </div>
                                                    }
                                                </Button>
                                            </Card>
                                        ))
                                        :
                                        (loadingFriend ?
                                        <div className='h-[400px] flex justify-center items-center'>
                                            <CircularProgress/>
                                        </div>
                                        :
                                        <Paper className='p-4 flex flex-col items-center'>
                                            <FcConferenceCall size={50}/>
                                            Nenhum Usuário Encontrado.
                                        </Paper>)
                                    }
                                </div>
                            }
                        </InfiniteScroll>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default MenuWrapper(Home)
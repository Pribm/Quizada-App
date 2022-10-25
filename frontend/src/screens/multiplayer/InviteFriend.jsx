import styled from '@emotion/styled';
import { Paper, Grid, CircularProgress, Button, Fab } from '@mui/material'
import FriendCardLarge from 'components/friendsCards/FriendCardLarge2';
import FriendCardSmall from 'components/friendsCards/FriendCardSmall';
import HorizontalQuizzCard from 'components/quizzCard/HorizontalQuizzCard';
import { SearchBox } from 'components/searchBox/SearchBox';
import React, { useEffect, useState } from 'react'
import { FcFolder } from 'react-icons/fc';
import { IoSend } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FriendsListComponent2 } from 'screens/friends/FriendsListComponent2';
import { index, massInvitation } from 'store/Actions/quizz.action';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


const InviteFriend = () => {


    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { quizz_list } = useSelector(state => state.quizzReducer)
    const [isLoading, setLoading] = useState(true)

    const [selectedQuizzIds, setSelectedQuizzIds] = useState([])
    const [searchQuizz, setSearchQuizz] = useState('')

    const [selectedFriendsIds, setSelectedFriendsIds] = useState([])

    useEffect(() => {
        dispatch(index()).then(() => setLoading(false))
    }, [])

    const handleSelectQuizz = e => {
        let selected = parseInt(e.target.value)

        if (e.target.checked) {
            setSelectedQuizzIds([...selectedQuizzIds, selected])
        } else {
            let newQuizzIdsList = selectedQuizzIds.filter(id => id !== selected)
            setSelectedQuizzIds(newQuizzIdsList)
        }
    }

    const handleSearchQuizz = () => {
        dispatch(index({ search: searchQuizz })).then(() => setLoading(false))
    }

    const handleSelectFriend = e => {
        let selected = parseInt(e.target.value)

        if (e.target.checked) {
            setSelectedFriendsIds([...selectedFriendsIds, selected])
        } else {
            let newFriendIdsList = selectedFriendsIds.filter(id => id !== selected)
            setSelectedFriendsIds(newFriendIdsList)
        }
    }

    return (
        <div className='px-4 relative'>

            <Paper className='container md:mx-auto bg-slate-50 text-white h-[calc(100vh-150px)]'>
                <div className='bg-blue-500 relative h-[60px] flex items-center px-4'>
                    Enviar convite de quiz para amigo
                    <Fab
                        onClick={() => dispatch(massInvitation({ quizzes: selectedQuizzIds, friends: selectedFriendsIds })).then(() => {
                            setSelectedFriendsIds([])
                        })}
                        className='absolute right-5 top-[50%] translate-y-[-50%]'
                        size='small'
                        color='secondary'>
                        <IoSend />
                    </Fab>
                </div>
                <Grid container className='w-[100%] h-[calc(100%-60px)] p-4 '>
                    <Grid item md={6} xs={12} className={'h-[50%] md:h-[100%] pr-0 md:pr-4  mb-2 md:m-0'}>
                        <Item className='bg-slate-100 h-[100%] overflow-y-scroll'>
                            <div className='bg-slate-400 rounded-md mb-2'>
                                <SearchBox
                                    placeholder='Quiz ou categoria'
                                    value={searchQuizz}
                                    onChange={e => setSearchQuizz(e.target.value)}
                                    searchHandler={handleSearchQuizz}
                                />
                            </div>

                            <h2 className='text-start mb-2 font-bold'>Selecione um quizz</h2>
                            {
                                !isLoading ?
                                    quizz_list.data?.length > 0 ?
                                        quizz_list?.data.map((quizz, i) => (
                                            <React.Fragment key={'quiz_invitation_' + i}>
                                                <HorizontalQuizzCard props={{ ...quizz, handleChange: handleSelectQuizz }} />
                                            </React.Fragment>
                                        ))
                                        :
                                        <Paper className='flex flex-col items-center p-4 w-[100%]'>
                                            <FcFolder size={100} />
                                            <h1 className='text-center'>Você ainda não possui nenhum quiz cadastrado, gostaria de criar um?</h1>
                                            <Button
                                                onClick={() => navigate('/quizz/create', { replace: true })}
                                                variant='contained'
                                                className='mt-2'>
                                                Sim, por favor!
                                            </Button>
                                        </Paper>
                                    :
                                    <div className='flex flex-1 justify-center'>
                                        <CircularProgress />
                                    </div>

                            }
                        </Item>
                    </Grid>
                    <Grid item md={6} xs={12} className='h-[50%] md:h-[100%] my-2 md:m-0'>
                        <FriendsListComponent2
                            className='h-[100%]'
                            Component={FriendCardSmall}
                            componentProps={{ handleChange: handleSelectFriend, selectedFriendsIds }} />
                    </Grid>
                    <div className='mx-auto p-8'>

                    </div>
                </Grid>
            </Paper>
        </div>

    )
}

export default InviteFriend
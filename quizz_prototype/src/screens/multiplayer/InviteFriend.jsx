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
import { index, massInvitation } from 'store/Actions/quizz.action';
import { FriendsListComponent } from '../friends/FriendsListComponent';

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
            <Fab
            onClick={() => dispatch(massInvitation({quizzes: selectedQuizzIds, friends: selectedFriendsIds}))}
            className='fixed top-[90px] right-5'
            size='small'
            color='secondary'>
                <IoSend/>
            </Fab>
            <Paper className='container md:mx-auto bg-slate-50 md:max-w-[60vw] overflow-hidden text-white'>
                <h1 className='bg-blue-500 p-4 mb-4'>Enviar convite de quizz para amigo</h1>
                <Grid container spacing={2} className='px-4'>
                    <Grid item md={6} xs={12}>
                        <Item className='bg-slate-100 h-[calc(50vh-100px)] overflow-y-scroll'>
                            <div className='bg-slate-400 rounded-md mb-2'>
                                <SearchBox
                                    placeholder='Quizz ou categoria'
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
                                            <h1 className='text-center'>Você ainda não possui nenhum quizz cadastrado, gostaria de criar um?</h1>
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
                    <Grid item md={6} xs={12}>
                        <FriendsListComponent
                            className='h-[calc(50vh-100px)]'
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
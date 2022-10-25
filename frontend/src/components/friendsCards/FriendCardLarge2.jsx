import React, { useState } from 'react'

import { getUserThumbnail } from 'utils/getThumbnails';
import { IoSend } from 'react-icons/io5';
import { makeInvitation } from 'store/Actions/quizz.action';
import { RiUserUnfollowFill } from 'react-icons/ri';
import { Avatar, CircularProgress, Paper, TextField, Button } from '@mui/material';
import { unfollowFriend } from 'store/Actions/friends.action';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const FriendCardLarge = ({friendsList, isLoading}) => {

    const dispatch = useDispatch()
    const [tokenState, setTokenState] = useState([])

    const handleInputToken = (e, id) => {
        let result = [...friendsList]
        result.map(x => {
            if (x.id === id) x.token = e.target.value;
            return x
        })
        setTokenState(result)
    }

    return (
        !isLoading ?
        friendsList.map((friend, i) => (
                <Paper key={'your_friend_' + i} className='min-h-[100px] flex flex-col items-center mb-4 py-4' elevation={2}>
                    <Avatar src={friend.avatar ? getUserThumbnail(friend.avatar, friend.id) : ''} alt={friend.name} className='mr-4' />
                    <p>{friend.name}</p>
                    <p className='text-sm'>{friend.email}</p>
                    <TextField
                        className='mt-2'
                        label='Enviar Token'
                        size='small'
                        onChange={e => handleInputToken(e, friend.id)}
                        value={friend.token || ''}
                        InputProps={{
                            endAdornment: (
                                <IoSend
                                    size={20}
                                    className='text-blue-500 cursor-pointer'
                                    onClick={() => dispatch(makeInvitation(tokenState[i].token, friend.id))}
                                />)
                        }}
                    />
                    <Button
                        className='mt-2'
                        onClick={() => dispatch(unfollowFriend(friend.id))}
                    >
                        <RiUserUnfollowFill className='mr-2' />
                        Deixar de Seguir
                    </Button>
                </Paper>
            ))
            :
            <div className='flex justify-center'><CircularProgress /></div>
    )
}

export default FriendCardLarge
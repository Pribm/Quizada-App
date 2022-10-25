import React, { useState } from 'react'

import { getUserThumbnail } from 'utils/getThumbnails';
import { IoSend } from 'react-icons/io5';
import { makeInvitation } from 'store/Actions/quizz.action';
import { RiUserUnfollowFill } from 'react-icons/ri';
import { Avatar, CircularProgress, Paper, TextField, Button } from '@mui/material';
import { unfollowFriend } from 'store/Actions/friends.action';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const FriendCardLarge = ({ props }) => {

    const { dispatch, handleInputToken, ...other} = props

    const [token, setToken] = useState('')

    return (
        <Paper className='min-h-[100px] flex flex-col items-center mb-4 py-4' elevation={2}>
            <Avatar src={other.avatar ? getUserThumbnail(other.avatar, other.id) : ''} alt={other.name} className='mr-4' />
            <p>{other.name}</p>
            <p className='text-sm'>{other.email}</p>
            <TextField
                className='mt-2'
                label='Enviar Token'
                size='small'
                onChange={e => setToken(e.target.value)}
                value={token || ''}
                InputProps={{
                    endAdornment: (
                        <IoSend
                            size={20}
                            className='text-blue-500 cursor-pointer'
                            onClick={() => dispatch(makeInvitation(token, other.id)).then(success => success && setToken(''))}
                        />)
                }}
            />
            <Button
                className='mt-2'
                onClick={() => dispatch(unfollowFriend(other.id))}
            >
                <RiUserUnfollowFill className='mr-2' />
                Deixar de Seguir
            </Button>
        </Paper>
    )
}

export default FriendCardLarge
import { Avatar, Button, Paper, Typography } from '@mui/material'
import React from 'react'
import { useDispatch } from 'react-redux'
import { acceptFriendshipInvitation } from 'store/Actions/friends.action'
import { getUserThumbnail } from 'utils/getThumbnails'

const AcceptFriendCard = ({ props }) => {

    const dispatch = useDispatch()

    return (
        <Paper
            className='mb-2 p-4 flex flex-wrap justify-center items-center'
        >
            <Avatar src={props.avatar ? getUserThumbnail(props.avatar, props.id) : ''} alt={props.name} className='mr-2' />
            <div className='ml-4 mr-auto'>
                <Typography color={'primary'} textAlign="start" noWrap={false} className='text-base font-bold'>
                    {props.name}
                </Typography>
                <Typography color={'secondary'} textAlign="start" noWrap={false} className='text-sm'>
                    {props.nickname}
                </Typography>
                <Typography textAlign="start" noWrap={false} className='text-sm'>
                    {props.email}
                </Typography>
            </div>
            <div className='flex flex-col ml-2'>
                <Button fullWidth
                    onClick={() => {
                        dispatch(acceptFriendshipInvitation(props.id, { accept_invitation: true }))
                    }}
                    variant='contained'
                    size='small'
                    className='my-2'>
                    Aceitar
                </Button>

                <Button
                fullWidth
                    onClick={() => dispatch(acceptFriendshipInvitation(props.id, { accept_invitation: false }))}
                    variant='contained'
                    color='error'
                    size='small'>
                    Recusar
                </Button>
            </div>
        </Paper>
    )
}

export default AcceptFriendCard
import { AppBar, Avatar, Badge, Box, Button, Chip, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { IoNotifications } from 'react-icons/io5'
import { RiMenu2Fill } from 'react-icons/ri'
import { BsFillQuestionSquareFill } from 'react-icons/bs'

import { useDispatch, useSelector } from 'react-redux'

import { change } from '../../store/Actions/mainMenu.action'
import { MdTimer, MdTimerOff } from 'react-icons/md'
import { useEffect } from 'react'
import { acceptFriendshipInvitation, acceptQuizzInvitation, index } from 'store/Actions/friends.action'
import { getUserThumbnail } from 'utils/getThumbnails'

const MenuHeader = () => {

    const dispatch = useDispatch()
    const {user} = useSelector(state => state.userReducer)
    const {friendship_requests: {data: requested_friendships}, user_quizz_requests: {data: quizzNotifications}} = useSelector(state => state.friendsReducer)

    useEffect(() => {
        dispatch(index({showFriendshipRequests: true}))
        dispatch(index({showQuizzRequests: true}))
    }, [])


    const [anchorElQuizz, setAnchorElQuizz] = React.useState(null);
    const [anchorElFriendshipRequest, setAnchorElFriendshipRequest] = React.useState(null);

    const handleOpenQuizzMenu = (event) => {
        if(quizzNotifications.length > 0){
            setAnchorElQuizz(event.currentTarget);
        }
    };
    
    const handleOpenFriendshipRequestMenu = (event) => {
        if(requested_friendships.length > 0){
            setAnchorElFriendshipRequest(event.currentTarget);
        }
    };

    const handleCloseQuizzMenu = (event) => {
        setAnchorElQuizz(null);
    };

    const handleCloseFriendshipRequestMenu = (event) => {
        setAnchorElFriendshipRequest(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }} className='mb-[80px]'>
            <AppBar position='fixed'>
                <Toolbar>
                    <RiMenu2Fill className='mr-auto text-white cursor-pointer' size={30} onClick={() => dispatch(change({open: true}))}/>
                    <Tooltip title="Solicitações de quizz">
                        <IconButton
                            size="large"
                            aria-label="show new notifications"
                            color="inherit"
                            onClick={handleOpenQuizzMenu}
                        >
                            <Badge badgeContent={quizzNotifications.length} color="error">
                                <BsFillQuestionSquareFill />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElQuizz}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElQuizz)}
                    onClose={handleCloseQuizzMenu}
                    className='max-h-[250px]'
                    PaperProps={{className: 'overflow-y-scroll'}}
                    >
                    {quizzNotifications.map((notification, i) => (
                        <MenuItem
                        key={'notification_'+i}
                        onClick={handleCloseQuizzMenu}
                        style={{whiteSpace: 'normal'}}
                        className='max-w-[300px]'
                        divider
                        sx={{display: 'flex', flexDirection: 'column'}}
                        >
                            <div className="flex items-center">
                                <Typography textAlign="start" noWrap={false}>
                                    {notification.user.nickname} lhe convidou para fazer {notification.questions_count} questões sobre {notification.title}
                                </Typography>
                                <div className='ml-2'>
                                    {notification.withTime ? <MdTimer size={20} className='text-green-500'/> : <MdTimerOff size={20} className='text-red-500'/>}
                                </div>
                            </div>
                            <div className="flex">
                                <Button
                                onClick={() => dispatch(acceptQuizzInvitation(notification.id))}
                                variant='contained'
                                className='mt-2 mx-2'>
                                    Aceitar
                                </Button>
                                <Button variant='contained' color='error' className='mt-2 mx-2'>
                                    Recusar
                                </Button>
                            </div>
                        </MenuItem>
                    ))}
                    </Menu>


                    <Tooltip title="Solicitações de amizade">
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                            onClick={handleOpenFriendshipRequestMenu}
                        >
                            <Badge badgeContent={requested_friendships?.length} color="error">
                                <IoNotifications />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElFriendshipRequest}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElFriendshipRequest)}
                    onClose={handleCloseFriendshipRequestMenu}
                    className='max-h-[250px]'
                    PaperProps={{className: 'overflow-y-scroll'}}
                    >
                    {requested_friendships.map((request_friendship, i) => (
                        <MenuItem
                        key={'notification_'+i}
                        onClick={handleCloseFriendshipRequestMenu}
                        style={{whiteSpace: 'normal'}}
                        className='max-w-[350px]'
                        divider
                        >
                            <Avatar src={getUserThumbnail(request_friendship.avatar, request_friendship.id)} alt={request_friendship.name} className='mr-2'/>
                            <Typography textAlign="start" noWrap={false} className='text-sm'>
                                {request_friendship.name} enviou uma solicitação de amizade!
                            </Typography>
                            <div className='flex flex-col ml-2'>
                            <Button
                            onClick={() => dispatch(acceptFriendshipInvitation(request_friendship.id, {accept_invitation: true}))}
                            variant='contained'
                            size='small'
                            className='my-2'>
                                Aceitar
                            </Button>

                            <Button
                            onClick={() => dispatch(acceptFriendshipInvitation(request_friendship.id, {accept_invitation: false}))}
                            variant='contained'
                            color='error'
                            size='small'>
                                Recusar
                            </Button>
                            </div>
                        </MenuItem>
                    ))}
                    </Menu>
                    <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-haspopup="false"
                    color="inherit"
                    disableTouchRipple
                    >
                        <Avatar alt={`${user.nickname} avatar`} src={user.avatar} />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default MenuHeader
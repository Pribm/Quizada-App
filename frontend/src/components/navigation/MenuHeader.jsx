import { AppBar, Avatar, Badge, Box, Button, Chip, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { IoNotifications } from 'react-icons/io5'
import { RiMenu2Fill } from 'react-icons/ri'
import { BsFillQuestionSquareFill } from 'react-icons/bs'

import { useDispatch, useSelector } from 'react-redux'

import { change } from '../../store/Actions/mainMenu.action'
import { MdTimer, MdTimerOff } from 'react-icons/md'
import { useEffect } from 'react'
import { acceptFriendshipInvitation, index } from 'store/Actions/friends.action'
import { getUserThumbnail } from 'utils/getThumbnails'
import { acceptAdmInvitation, acceptQuizzInvitation, openNotifications, refuseQuizzInvitation } from 'store/Actions/user.action'
import { Link } from 'react-router-dom'

const MenuHeader = () => {

    const dispatch = useDispatch()
    const { user, notifications_from } = useSelector(state => state.userReducer)
    const { user_quizz_requests: { data: quizzNotifications } } = useSelector(state => state.friendsReducer)

    const [anchorElQuizz, setAnchorElQuizz] = React.useState(null);
    const [anchorElNotifications, setAnchorElNotifications] = React.useState(null);

    


    

    const handleOpenQuizzMenu = (event) => {
        if (notifications_from.data.filter(n => n.pivot.notification_type === 'quizz_request').length > 0) {
            setAnchorElQuizz(event.currentTarget);
        }
    };

    const handleOpenNotification = (event) => {
        if (notifications_from.data.filter(n => n.pivot.notification_type !== 'quizz_request').length > 0) {
            setAnchorElNotifications(event.currentTarget);
        }
    };

    const handleCloseQuizzMenu = (event) => {
        setAnchorElQuizz(null);

        handleDispenseNotification(['quizz_request'])
    };

    const handleCloseNotifications = (event) => {
        setAnchorElNotifications(null);

        handleDispenseNotification([
            'friendship_accepted',
            'friendship_request',
            'quizz_accepted',
            'quizz_complete',
            'admin_accepted',
        ])
    };

    const handleDispenseNotification = dispensableTypes => {
        let dispensableNotifications = []
        notifications_from.data.forEach(element => {
            if (dispensableTypes.includes(element.pivot.notification_type)) {
                dispensableNotifications.push(element.pivot.id)
            }
        });

        dispatch(openNotifications(dispensableNotifications))
    }

    return (
        <Box sx={{ flexGrow: 1 }} className='mb-[80px]'>
            <AppBar position='fixed'>
                <Toolbar>
                    <RiMenu2Fill className='mr-auto text-white cursor-pointer' size={30} onClick={() => dispatch(change({ open: true }))} />
                    <Tooltip title="Solicitações de quizz">
                        <IconButton
                            size="large"
                            aria-label="show new notifications"
                            color="inherit"
                            onClick={handleOpenQuizzMenu}
                        >
                            <Badge badgeContent={notifications_from?.data.filter(n => {
                                if(n.pivot.notification_type === 'quizz_request' && n.pivot.opened_notification === 0){
                                    return n
                                }
                            }).length} color="error">
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
                        PaperProps={{ className: 'overflow-y-scroll' }}
                    >
                        {notifications_from?.data.filter(n => n.pivot.notification_type === 'quizz_request').map((notification, i) => (
                            <MenuItem
                                key={'notification_' + i}
                                onClick={handleCloseQuizzMenu}
                                style={{ whiteSpace: 'normal' }}
                                className='max-w-[300px]'
                                divider
                                sx={{ display: 'flex', flexDirection: 'column' }}
                            >
                                    <Avatar
                                    src={notification.avatar ? getUserThumbnail(notification.avatar, notification.id) : ''}
                                    alt={notification.name}
                                    />
                                    <Typography textAlign="start" noWrap={false}>
                                        {notification?.pivot.message}
                                    </Typography>
                                    <Button variant='contained' size='small' className='mt-2'>
                                        <Link to='/quizz/invitations?requests=true'>
                                            Ver Solicitações de Quizz
                                        </Link>
                                    </Button>
                            </MenuItem>
                        ))}
                    </Menu>


                    <Tooltip title="Notificações">
                        <IconButton
                            size="large"
                            aria-label="mostrar novas notificações"
                            color="inherit"
                            onClick={handleOpenNotification}
                        >
                            <Badge badgeContent={notifications_from.data.filter(n => {
                                if(n.pivot.notification_type !== 'quizz_request' && n.pivot.opened_notification === 0){
                                    return n
                                }
                            }).length} color="error">
                                <IoNotifications />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElNotifications}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElNotifications)}
                        onClose={handleCloseNotifications}
                        className='max-h-[250px]'
                        PaperProps={{ className: 'overflow-y-scroll' }}
                    >
                        {notifications_from.data.filter(n => n.pivot.notification_type !== 'quizz_request').map((notification, i) => (
                            <MenuItem
                                key={'notification_' + i}
                                onClick={handleCloseNotifications}
                                style={{ whiteSpace: 'normal' }}
                                className='max-w-[350px]'
                                divider
                            >
                                <Avatar src={notification.avatar ? getUserThumbnail(notification.avatar, notification.id) : ''} alt={notification.name} className='mr-2' />
                                <Typography textAlign="start" noWrap={false} className='text-sm'>
                                    {notification.pivot.message}
                                </Typography>
                                {
                                    (notification.pivot.notification_type === 'friendship_request') &&
                                    <Button >
                                        <Link to='/friends?requests=true'>
                                            Ver Solicitações de Amizade
                                        </Link>
                                    </Button>
                                }
                                {
                                    (notification.pivot.notification_type === 'admin_request') &&
                                    <div className='flex flex-col ml-2'>
                                        <Button
                                            onClick={() => {
                                                dispatch(acceptAdmInvitation(true))
                                                handleDispenseNotification(['admin_request'])
                                            }}
                                            variant='contained'
                                            size='small'
                                            className='my-2'>
                                            Aceitar
                                        </Button>

                                        <Button
                                            onClick={() => {
                                                dispatch(acceptAdmInvitation(false))
                                                handleDispenseNotification(['admin_request'])
                                            }}
                                            variant='contained'
                                            color='error'
                                            size='small'>
                                            Recusar
                                        </Button>
                                    </div>
                                }
                            </MenuItem>
                        ))}
                    </Menu>
                    <Tooltip title={user.name || ''}>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-haspopup="false"
                        color="inherit"
                        disableTouchRipple
                    >
                        <Avatar alt={`${user.name} avatar`} src={user.avatar ? getUserThumbnail(user.avatar, user.id) : ''} />
                    </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default MenuHeader
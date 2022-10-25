import React, { useEffect, useState } from 'react'

import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, Divider, CircularProgress } from '@mui/material'
import { HiX } from 'react-icons/hi'

import {IoMdLogOut} from 'react-icons/io'
import {BiDonateHeart} from 'react-icons/bi'

import {useSelector, useDispatch} from 'react-redux'
import { logo } from '../../assets'
import { logout } from '../../store/Actions/auth.action'
import { change } from '../../store/Actions/mainMenu.action'
import { change as changeModal } from 'store/Actions/modal.action'

import { drawerLinks } from './links'

import { Link } from 'react-router-dom'
import { index } from 'store/Actions/app.action'
import { MdMail } from 'react-icons/md'

const DrawerMenu = () => {

    const {open} = useSelector(state => state.mainMenuReducer)
    const {user} = useSelector(state => state.userReducer)
    const {appData} = useSelector(state => state.appReducer)

    const dispatch = useDispatch()

    const [loading, setLoading] = useState([])

    useEffect(() => {
        if(Object.keys(appData).length === 0){
            dispatch(index()).then(() => setLoading(false))
        }
    }, [])

    const MenuItems = () => (
        <Box
            role='presentation'
            className='w-[75vw] md:w-[25vw] flex flex-col h-screen'
            onClick={() => dispatch(change({open: false}))}
            
        >
            <div className='h-[100px] flex items-center justify-start p-6'>
                <img src={logo} alt='quizzada logo' className='h-[100%] m-0'/>
                <div>
                    <span className=' text-blue-600 text-[2rem] md:text-[3rem] ml-2 font-bold logo-font'>Qui</span>
                    <span className=' text-orange-500 text-[2rem] md:text-[3rem] font-bold logo-font'>z</span>
                    <span className='logo-font font-bold  text-blue-400 text-[2rem] md:text-[3rem]'>ada</span>
                </div>
            </div>

            <List className='bg-slate-50 h-[calc(100vh-100px-200px)] overflow-scroll'>
                {
                    (!user.role_id && loading) ?
                    <div className='flex justify-center'>
                        <CircularProgress/>
                    </div>
                    :
                    drawerLinks.filter(link => (link.user_role !== user.role.role && typeof link.user_role === 'undefined'))
                    .concat(drawerLinks.filter(link => (link.user_role === user.role.role)))
                    .map((link, i) => (
                        <React.Fragment key={`link_${i}`}>
                            <Link to={link.linkTo} onClick={link?.action && link.action} replace={false}>
                                <ListItem>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            {link.icon}
                                        </ListItemIcon>
                                        <ListItemText>
                                            {link.text}
                                        </ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                            {link.setDivider && <Divider />}
                        </React.Fragment>
                    )
                    )
                }
            </List>

            <div className='h-[200px] flex flex-col py-2'>
                <Link
                    to='/donate'
                    className='mx-4 mt-auto mb-4 flex items-center text-orange-600 hover:bg-orange-600 text-sm hover:text-white'
                    color='secondary'
                    style={{ border: 'solid orange 1px', padding: '8px', borderRadius: '10px' }}
                >
                    <BiDonateHeart size={25} className='mr-4' />
                    {appData.payment_button}
                </Link>
                <Button
                onClick={() => dispatch(changeModal({open: true, modalComponent: 'emailForm', modalTitle: 'Envie um email com alguma sugestão ou crítica.'}))}
                className='mx-4  mb-2 rounded-lg'
                variant='outlined'
                color='primary'
                sx={{ textTransform: 'initial', outline: '#00F 1px solid' }}
                >
                    <MdMail size={25} className='mr-4' />
                    Enviar um email para o suporte
                </Button>
                <Button
                    variant='contained'
                    onClick={() => dispatch(logout())}
                    className='mx-4 mt-2 mb-4'
                >
                    <IoMdLogOut size={25} className='mr-4' />
                    Logout
                </Button>
            </div>

            <HiX size={30} className='absolute md:top-10 md:right-10 top-9 right-5 cursor-pointer text-blue-500' onClick={() => dispatch(change({open: false}))}/>
        </Box>
    )

  return (
    <Drawer
      anchor={'left'}
      open={open}
      ModalProps={{
        onClick: () => dispatch(change({open: false}))
      }}
    >
        <MenuItems/>
    </Drawer>
  )
}

export default DrawerMenu
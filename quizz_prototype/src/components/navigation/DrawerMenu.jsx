import React from 'react'

import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button, Divider, CircularProgress } from '@mui/material'
import { HiX } from 'react-icons/hi'

import {IoMdLogOut} from 'react-icons/io'
import {BiDonateHeart} from 'react-icons/bi'

import {useSelector, useDispatch} from 'react-redux'
import { logo } from '../../assets'
import { logout } from '../../store/Actions/auth.action'
import { change } from '../../store/Actions/mainMenu.action'

import { drawerLinks } from './links'

import { Link } from 'react-router-dom'

const DrawerMenu = () => {

    const {open} = useSelector(state => state.mainMenuReducer)
    const {user} = useSelector(state => state.userReducer)

    const dispatch = useDispatch()



    const MenuItems = () => (
        <Box
            role='presentation'
            className='w-[75vw] md:w-[25vw] flex flex-col min-h-screen'
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

            <List>
                {
                    !user.role_id ?
                    <div className='flex justify-center'>
                        <CircularProgress/>
                    </div>
                    :
                    drawerLinks.filter(link => (link.user_role !== user.role.role && typeof link.user_role === 'undefined'))
                    .concat(drawerLinks.filter(link => (link.user_role === user.role.role)))
                    .map((link, i) => (
                        <React.Fragment key={`link_${i}`}>
                            <Link to={link.linkTo} onClick={link?.action && link.action} replace={true}>
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

            <Link
            to='/donate'
            className='mx-4 mt-auto mb-4 flex items-center text-orange-600 hover:bg-orange-600 text-sm hover:text-white'
            color='secondary'
            style={{border :'solid orange 1px', padding: '8px', borderRadius: '10px'}}
            >
                <BiDonateHeart size={25} className='mr-4'/>
                Colabore com as melhorias do app
            </Link>
            <Button
            variant='contained'
            onClick={() => dispatch(logout())}
            className='mx-4 mt-2 mb-4'
            >
                <IoMdLogOut size={25} className='mr-4'/>
                Logout
            </Button>

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
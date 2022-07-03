import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button } from '@mui/material'

import React from 'react'
import { HiX, HiEye } from 'react-icons/hi'

import {IoMdCreate, IoMdLogOut} from 'react-icons/io'
import { RiEditLine } from 'react-icons/ri'

import {useSelector, useDispatch} from 'react-redux'
import { logo } from '../../assets'
import { logout } from '../../store/Actions/auth.action'
import { change } from '../../store/Actions/mainMenu.action'
import {change as changeQuizz} from 'store/Actions/quizz.action'

import {Link} from 'react-router-dom'

const MainMenu = () => {

    const links = [
        {
            text: 'Criar um novo quizz',
            icon: <IoMdCreate/>,
            linkTo: '/quizz/create',
            action: () => dispatch(changeQuizz('clear'))
        },
        {
            text: 'Editar um quizz existente',
            icon: <RiEditLine/>,
            linkTo: '/quizz/update',

        },
        {
            text: 'Ver questões que você criou',
            icon: <HiEye/>,
            linkTo: '/questions/index',

        },
    ]

    const {open} = useSelector(state => state.mainMenuReducer)

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
                    <span className=' text-blue-600 text-[2rem] md:text-[3rem] ml-2 font-bold logo-font'>Quiz</span><span className='logo-font font-bold  text-blue-400 text-[2rem] md:text-[3rem]'>zada</span>
                </div>
            </div>
            <List>
                {
                    links.map((link, i) => (
                        <Link to={link.linkTo} key={`link_${i}`} onClick={link?.action && link.action}>
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
                    )
                )
                }
            </List>

            <Button
            onClick={() => dispatch(logout())}
            className='mt-auto mb-4 bg-blue-500 text-white mx-4 capitalize hover:bg-orange-500'>
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
    >
        <MenuItems/>
    </Drawer>
  )
}

export default MainMenu
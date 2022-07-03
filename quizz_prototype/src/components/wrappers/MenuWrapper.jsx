import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import React from 'react'
import { IoMdHome } from 'react-icons/io'
import { IoPerson, IoPodium } from 'react-icons/io5'
import MainMenu from '../main_menu/MainMenu'
import MenuHeader from './MenuHeader'

import { useNavigate } from 'react-router-dom'

const BottomNavbar = () => {
    const navigate = useNavigate()

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: '1000' }} elevation={3}>
            <BottomNavigation
                showLabels
                className='bg-orange-500'
    
            >
                <BottomNavigationAction
                    className='text-white'
                    label='Home'
                    icon={<IoMdHome />}
                    onClick={() => navigate('/home', { replace: true })}
                />
    
                <BottomNavigationAction className='text-white' label='Ranking' icon={<IoPodium />} />
                <BottomNavigationAction className='text-white' label='Perfil' icon={<IoPerson />} />
            </BottomNavigation>
        </Paper>
    )
}

const MenuWrapper = (Component) => {



    return () => {
        return (
            <div className='bg-gradient-to-b from-blue-400 min-h-screen to-indigo-500'>
                <div className="pb-[5rem] mx-auto">
                    <MenuHeader />

                    <MainMenu />

                    <Component />


                    <BottomNavbar/>
                </div>
            </div>
        )
    }
}


export default MenuWrapper
import React from 'react'

import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'

import { useNavigate } from 'react-router-dom'

import { bottomNavbarLinks } from './links'

const BottomNavbar = () => {
    const navigate = useNavigate()

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: '1000' }} elevation={3}>
            <BottomNavigation
                showLabels
                className='bg-orange-500'
    
            >
                {bottomNavbarLinks.map((link, i) => (

                        <BottomNavigationAction
                        key={'bottomLink'+i}
                        className='text-white capitalize'
                        showLabel
                        label={link.label}
                        icon={link.icon}
                        onClick={() => navigate(link.linkTo)}
                        />

                ))}
            </BottomNavigation>
        </Paper>
    )
}

export default BottomNavbar
import React from 'react'


import MenuHeader from '../navigation/MenuHeader'

import BottomNavbar from 'components/navigation/BottomNavbar'
import DrawerMenu from 'components/navigation/DrawerMenu'
import Rules from 'components/rules/Rules'
import { Fab } from '@mui/material'
import { FaHandsHelping } from 'react-icons/fa'

const MenuWrapper = (Component) => {

    return () => {

        return (
            <div className='bg-gradient-to-b from-blue-400 min-h-screen min-w-[100vw] to-indigo-500 max-w-[100vw] relative' style={{display: 'table'}}>
                <div className="max-w-[100vw]" style={{display: 'table-cell', verticalAlign: 'middle'}}>
                    <MenuHeader />
                    <DrawerMenu />
                    <div className='mb-[60px]'>
                    <Component />
                    </div>
                    <Rules/>
                    <BottomNavbar/>
                </div>
            </div>
        )
    }
}


export default MenuWrapper
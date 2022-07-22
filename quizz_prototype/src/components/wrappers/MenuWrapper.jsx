import React from 'react'


import MenuHeader from '../navigation/MenuHeader'

import BottomNavbar from 'components/navigation/BottomNavbar'
import DrawerMenu from 'components/navigation/DrawerMenu'

const MenuWrapper = (Component) => {

    return () => {
        return (
            <div className='bg-gradient-to-b from-blue-400 min-h-screen min-w-[100vw] to-indigo-500 max-w-[100vw]' style={{display: 'table'}}>
                <div className="max-w-[100vw]" style={{display: 'table-cell', verticalAlign: 'middle'}}>
                    <MenuHeader />
                    <DrawerMenu />
                    <Component />
                    <BottomNavbar/>
                </div>
            </div>
        )
    }
}


export default MenuWrapper
import { Avatar } from '@mui/material'
import React from 'react'
import { RiMenu2Fill } from 'react-icons/ri'

import { useDispatch } from 'react-redux'

import { change } from '../../store/Actions/mainMenu.action'

const MenuHeader = () => {

    const dispatch = useDispatch()

    return (
        <div className='flex justify-between p-5'>
            <div className='flex items-center flex-1'>
                <RiMenu2Fill className='mr-auto text-white cursor-pointer' size={30} onClick={() => dispatch(change({open: true}))}/>
                <div className='text-white mr-4'>
                    <h3>Olá, Fulano de tal</h3>
                    <h4>Que tal iniciar um novo quizz?</h4>
                </div>
                <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
            </div>
        </div>
    )
}

export default MenuHeader
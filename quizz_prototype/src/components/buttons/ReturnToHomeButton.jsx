import React from 'react'
import { IoMdHome } from 'react-icons/io'
import { Link } from 'react-router-dom'

const ReturnToHomeButton = ({bgColor = 'white' , bgHover, textColor = 'orange-500', textHover}) => {
    return (
        <Link
            className={`flex items-center justify-center bg-${bgColor}  text-${textColor} mb-4 py-2 px-4 rounded-lg w-[250px]`} style={{ border: 'solid #f6833b 1px' }}
            to='/home'
        >
            <IoMdHome className='mr-2' />
            Voltar ao Menu principal
        </Link>
    )
}

export default ReturnToHomeButton
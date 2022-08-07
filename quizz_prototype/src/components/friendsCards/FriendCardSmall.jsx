import { Avatar, Checkbox } from '@mui/material'
import React from 'react'
import { getUserThumbnail } from 'utils/getThumbnails'

const FriendCardSmall = (props) => {
    const { friendsList, isLoading, ...other } = props
    return (

        <div className='bg-white shadow-md rounded-md h-[100px] flex items-center p-2 mb-4'>
            <Avatar src={other.props.avatar ? getUserThumbnail(other.props.avatar, other.props.id) : ''} alt={other.props.name} />
            <div className='px-2 text-start flex-1 text-sm'>
                <h1 className='font-bold text-blue-500'>{other.props.name}</h1>
                <h2 className='text-orange-500'>{other.props.nickname}</h2>
                <h3>{other.props.email}</h3>
            </div>
            <div className='flex justify-center items-center'>
                <Checkbox
                    inputProps={{ 'aria-label': 'controlled' }}
                    value={other.props.id}
                    onChange={e => other.props.handleChange(e)}
                    checked={other.props.selectedFriendsIds.includes(other.props.id)}
                />
            </div>
        </div>
    )
}

export default FriendCardSmall
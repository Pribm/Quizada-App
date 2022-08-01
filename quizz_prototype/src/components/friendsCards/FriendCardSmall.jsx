import { Avatar, Checkbox, CircularProgress } from '@mui/material'
import React from 'react'
import { getUserThumbnail } from 'utils/getThumbnails'

const FriendCardSmall = (props) => {
    const { friendsList, isLoading, ...other } = props
    return (
        !isLoading ?
            friendsList.map((friend, i) => (
                <div className='bg-white shadow-md rounded-md h-[100px] flex items-center p-2 mb-4' key={'small_friend_card_'+i}>
                    <Avatar src={friend.avatar ? getUserThumbnail(friend.avatar, friend.id): ''} alt={friend.name}/>
                    <div className='px-2 text-start flex-1 text-sm'>
                        <h1 className='font-bold text-blue-500'>{friend.name}</h1>
                        <h2 className='text-orange-500'>{friend.nickname}</h2>
                        <h3>{friend.email}</h3>
                    </div>

                    <div className='flex justify-center items-center'>
                        <Checkbox
                            inputProps={{ 'aria-label': 'controlled' }}
                            value={friend.id}
                            onChange={e => other.props.handleChange(e)}
                            checked={other.props.selectedFriendsIds.includes(friend.id)}
                        />
                    </div>
                </div>
            ))
            :
            <div className='flex justify-center'><CircularProgress /></div>
    )
}

export default FriendCardSmall
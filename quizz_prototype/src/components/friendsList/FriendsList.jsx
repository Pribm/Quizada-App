import { Avatar, Button, Card, CircularProgress, Paper } from '@mui/material'
import React from 'react'
import { FcDecision } from 'react-icons/fc'
import { HiUserAdd } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'

import InfiniteScroll from 'react-infinite-scroller';
import { addFriend } from 'store/Actions/friends.action'
import { RiUserFollowFill } from 'react-icons/ri'


const FriendsList = ({friendsList, handleLoadMore, className}) => {

    const dispatch = useDispatch()
    const {isLoading} = useSelector(state => state.friendsReducer)

  return (
    <Paper className={`bg-slate-100 h-[450px] overflow-auto relative hideScroll w-[100%] ${className}`} >
        <InfiniteScroll
            pageStart={0}
            loadMore={handleLoadMore}
            hasMore={true}
            initialLoad={false}
            loader={<div className='flex justify-center relative' key={'loader_friends_0'}>
                <CircularProgress/>
                </div>}
            useWindow={false}
        >

            <h4 className='sticky top-[0px] p-4 text-white mb-4 z-10 bg-blue-400 '>Adicionar Amigos</h4>
            <div className='px-4'>
            {
                !isLoading &&
                (friendsList?.data.length > 0) ?
                friendsList?.data.map((friend, i) => (
                    <Card className='flex min-h-[100px] items-center p-4 mb-4' key={'home_screen_friend_'+i}>
                        <div>
                            <Avatar src={friend.avatar} alt={friend.name}>
                                {friend.name[0]}
                            </Avatar>
                        </div>
                        <div className='ml-4 mr-auto'>
                            <h3>
                                {
                                    friend.name
                                }
                            </h3>
                            <h4>
                                {
                                    friend.email
                                }
                            </h4>
                        </div>
                        <Button onClick={() => dispatch(addFriend(friend.id))}>
                            {
                                ("pivot" in friend) ?
                                <div className='text-sky-500 flex flex-col items-center '>
                                <RiUserFollowFill size={25} />
                                <h5 className='text-[.5rem]'>Solicitação enviada</h5>
                                </div>
                                :
                                <div className='text-slate-500 flex flex-col items-center '>
                                    <HiUserAdd size={30}/>
                                    <h5 className='text-[.5rem]'>Enviar Solicitação</h5>
                                </div>
                            }
                        </Button>
                    </Card>
                ))
                :
                <Card className='flex flex-col min-h-[100px] items-center justify-center p-4 mb-4'>
                    <FcDecision size={80}/>
                    Você não tem nenhum amigo disponível.        
                </Card>
            }
            </div>
        </InfiniteScroll>
    </Paper>
  )
}

export default FriendsList
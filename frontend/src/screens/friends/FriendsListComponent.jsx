import { SearchBox } from 'components/searchBox/SearchBox'
import React from 'react'
import { useState } from 'react';
import { changeLoading } from 'store/Actions/loading.action';

import { FcFolder } from 'react-icons/fc';

import { useDispatch, useSelector } from 'react-redux';
import { index } from 'store/Actions/friends.action';
import { Paper } from '@mui/material';
import { ListWrapper } from 'components/wrappers/ListWrapper';
import FriendCardLarge from 'components/friendsCards/FriendCardLarge';

export const FriendsListComponent = () => {

    const dispatch = useDispatch()
    const { yourFriends, yourFriends: {current_page} } = useSelector(state => state.friendsReducer)

    const [search, setSearch] = useState('')
    const [isLoading, setLoading] = useState(true)
    const [isSearching, setSearching] = useState(false)

    
    React.useEffect(() => {
        dispatch(index({ showFriendsList: true })).then(() => setLoading(false))
    }, [])


    React.useEffect(() => {
        if (isSearching) {
            searchHandler()
        }
    }, [isSearching])
    
    const searchHandler = () => {
        setSearching(true)
        dispatch(changeLoading({ open: true, text: 'Procurando Usuário...' }))
        dispatch(index({ showFriendsList: true, search: search })).then(() => {
            setSearching(false)
            dispatch(changeLoading({ open: false }))
        })
    }
    
    const handleLoadMore = () => {
       return dispatch(index({showFriendsList: true, page: current_page + 1}, true))
    }
    
    
    return (
        <div className='h-[calc(100vh-300px)]'>
            <ListWrapper
                Component={FriendCardLarge}
                componentData={yourFriends}
                componentProps={{ dispatch }}
                handleLoadMore={handleLoadMore}
                search={search}
                setSearch={setSearch}
                searchHandler={searchHandler}
                isLoading={isLoading}
                setLoading={setLoading}
                searchBoxPlaceholder={'Nome, Apelido ou e-mail'}
                listTitle={'Usuários da plataforma'}
                notFoundList={'Nenhum Usuário foi encontrado'}
            />
        </div>
    )
}

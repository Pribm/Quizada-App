import AcceptFriendCard from 'components/friendsCards/AcceptFriendCard'
import { ListWrapper } from 'components/wrappers/ListWrapper'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { index } from 'store/Actions/friends.action'
import { changeLoading } from 'store/Actions/loading.action'

const FriendshipInvitations = () => {


    const dispatch = useDispatch()
    const { friendship_requests, friendship_requests: {current_page} } = useSelector(state => state.friendsReducer)

    const [search, setSearch] = useState('')
    const [isLoading, setLoading] = useState(true)
    const [isSearching, setSearching] = useState(false)

    
    React.useEffect(() => {
        dispatch(index({ showFriendshipRequests: true })).then(() => setLoading(false))
    }, [])


    React.useEffect(() => {
        if (isSearching) {
            searchHandler()
        }
    }, [isSearching])
    
    const searchHandler = () => {
        setSearching(true)
        dispatch(changeLoading({ open: true, text: 'Procurando Usuário...' }))
        dispatch(index({ showFriendshipRequests: true, search: search })).then(() => {
            setSearching(false)
            dispatch(changeLoading({ open: false }))
        })
    }
    
    const handleLoadMore = () => {
        dispatch(index({showFriendshipRequests: true, page: current_page + 1}, true))
    }

    return (
            <ListWrapper
                Component={AcceptFriendCard}
                className={'min-h-[calc(100vh-120px-120px)] max-h-[calc(100vh-120px-120px)]'}
                componentData={friendship_requests}
                handleLoadMore={handleLoadMore}
                search={search}
                setSearch={setSearch}
                searchHandler={searchHandler}
                isLoading={isLoading}
                setLoading={setLoading}
                searchBoxPlaceholder={'Nome, Apelido ou e-mail'}
                listTitle={'Convites de amizade recebidos'}
                notFoundList={'Nenhum Usuário foi encontrado'}
            />
    )
}

export default FriendshipInvitations
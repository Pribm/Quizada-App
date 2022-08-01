import { SearchBox } from 'components/searchBox/SearchBox'
import React from 'react'
import { useState } from 'react';
import { changeLoading } from 'store/Actions/loading.action';

import { FcFolder } from 'react-icons/fc';

import { useDispatch, useSelector } from 'react-redux';
import { index } from 'store/Actions/friends.action';
import { Paper } from '@mui/material';

export const FriendsListComponent = (props) => {

    const {Component,componentProps, ...others} = props

    const dispatch = useDispatch()
    const { yourFriends } = useSelector(state => state.friendsReducer)

    const [search, setSearch] = useState('')
    const [isLoading, setLoading] = useState(true)
    const [isSearching, setSearching] = useState(false)

    React.useEffect(() => {
        dispatch(index({ showFriendsList: true })).then(() => setLoading(false))
    }, [])


    React.useEffect(() => {
        if (isSearching) {
            handlesearching()
        }
    }, [isSearching])

    const handlesearching = () => {
        setSearching(true)
        dispatch(changeLoading({ open: true, text: 'Procurando Usuário...' }))
        dispatch(index({ showFriendsList: true, search: search })).then(() => {
            setSearching(false)
            dispatch(changeLoading({ open: false }))
        })
    }

    

    return (
        <Paper className={`text-xl overflow-y-scroll hideScroll relative bg-slate-100 ${others.className}`}>
            <div className='p-2'>
                <div className='bg-slate-400 rounded-md mb-2 text-sm'>
                    <SearchBox
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        searchHandler={handlesearching}
                        className='pl-8'
                        placeholder={'Nome, Apelido ou e-mail'}
                    />
                </div>
            </div>
            <div className='p-4'>
                {
                    <>
                    <h2 className='text-start mb-2 font-bold text-sm text-slate-600'>Envie um quizz para um amigo</h2>
                        {
                            (!isLoading && yourFriends.data.length === 0) &&
                            <Paper className='min-h-[100px] flex flex-col items-center mb-4 py-4 px-4' elevation={2}>
                                <FcFolder size={60} />
                                <h4 className='text-sm text-center'>Você ainda não possui nenhum amigo para enviar um quizz. Adicione um amigo para começar.</h4>
                            </Paper>
                        }
                        <Component friendsList={yourFriends.data} isLoading={isLoading} props={{...componentProps}}/>
                    </>
                }
            </div>
        </Paper>
    )
}

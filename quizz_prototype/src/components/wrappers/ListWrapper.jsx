import { SearchBox } from 'components/searchBox/SearchBox'
import React from 'react'
import { useState } from 'react';
import { changeLoading } from 'store/Actions/loading.action';

import { FcFolder } from 'react-icons/fc';

import { useDispatch, useSelector } from 'react-redux';
import { index } from 'store/Actions/friends.action';
import { CircularProgress, Paper } from '@mui/material';

import InfiniteScrollComponent from 'components/infiniteScroll/InfiniteScroll';
import InfiniteScroll from 'react-infinite-scroller';

export const ListWrapper = (props) => {

    const {
        Component,
        componentProps,
        hideSearchBox,
        componentData,
        search,
        setSearch,
        searchHandler,
        isLoading, setLoading,
        searchBoxPlaceholder,
        listTitle,
        notFoundList,
        handleLoadMore,
        ...others
    } = props

    return (
        <Paper className={`text-xl bg-slate-100 h-[650px]`}>
            {
                !hideSearchBox && 
                <div className='p-2'>
                <div className='bg-slate-400 rounded-md mb-2 text-sm'>
                    <SearchBox
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        searchHandler={searchHandler}
                        className='pl-8'
                        placeholder={searchBoxPlaceholder}
                    />
                </div>
            </div>
            }

            <div className={`p-4 overflow-auto hideScroll relative ${!hideSearchBox ? 'h-[calc(100%-90px)]' : 'h-[99%]'}`}>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={handleLoadMore}
                    hasMore={componentData.current_page < componentData.last_page}
                    initialLoad={false}
                    loader={
                        componentData.current_page !== 0 ?
                            <div className='flex justify-center h-[40px]' key={'loader_friends_0'}>
                                <CircularProgress size={20} />
                            </div> : ''}
                    useWindow={false}
                >
                    {
                        <>
                            <h2 className='text-start mb-2 font-bold text-sm text-slate-600'>{
                                listTitle
                            }</h2>
                            {
                                (!isLoading && componentData.data.length === 0) &&
                                <Paper className='min-h-[100px] flex flex-col items-center mb-4 py-4 px-4' elevation={2}>
                                    <FcFolder size={60} />
                                    <h4 className='text-sm text-center'>{notFoundList}</h4>
                                </Paper>
                            }
                            {
                                !isLoading ?
                                    componentData.data.map((elementProps, i) => (
                                        <Component props={{ ...elementProps, ...componentProps }} key={(Math.random() + 1).toString(36).substring(7) + i} />
                                    ))
                                    :
                                    <div className='flex justify-center'><CircularProgress /></div>
                            }
                        </>
                    }
                </InfiniteScroll>
            </div>
        </Paper>
    )
}

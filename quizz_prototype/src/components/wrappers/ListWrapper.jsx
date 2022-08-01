import { SearchBox } from 'components/searchBox/SearchBox'
import React from 'react'
import { useState } from 'react';
import { changeLoading } from 'store/Actions/loading.action';

import { FcFolder } from 'react-icons/fc';

import { useDispatch, useSelector } from 'react-redux';
import { index } from 'store/Actions/friends.action';
import { CircularProgress, Paper } from '@mui/material';

export const ListWrapper = (props) => {

    const {
        Component,
        componentProps,
        componentData,
        search,
        setSearch,
        searchHandler,
        isLoading,setLoading,
        searchBoxPlaceholder,
        listTitle,
        notFoundList,
        ...others
    } = props

    return (
        <Paper className={`text-xl overflow-y-scroll hideScroll relative bg-slate-100 ${others.className}`}>
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
            <div className='p-4'>
                {
                    <>
                    <h2 className='text-start mb-2 font-bold text-sm text-slate-600'>{
                        listTitle
                    }</h2>
                        {
                            (!isLoading && componentData.length === 0) &&
                            <Paper className='min-h-[100px] flex flex-col items-center mb-4 py-4 px-4' elevation={2}>
                                <FcFolder size={60} />
                                <h4 className='text-sm text-center'>{notFoundList}</h4>
                            </Paper>
                        }
                        {
                            !isLoading ?
                            componentData.map((elementProps, i) => (
                                <Component  props={{...elementProps, ...componentProps}} key={(Math.random() + 1).toString(36).substring(7)+i}/>
                            ))
                            :
                            <div className='flex justify-center'><CircularProgress /></div>
                        }
                    </>
                }
            </div>
        </Paper>
    )
}

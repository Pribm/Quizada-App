import { SearchBox } from 'components/searchBox/SearchBox'
import React, { useEffect, useState } from 'react'

import { FcFolder } from 'react-icons/fc';
import { CircularProgress, Paper } from '@mui/material';

//import InfiniteScroll from 'react-infinite-scroll-component';

const List = ({setLoadingMore, listTitle, isLoading, componentData, notFoundList, NotFoundButtonComponent, Component, componentProps, isLoadingMore}) => (
    <div className='overflow-auto scrollbar h-[calc(100%-55px)] p-4' onScroll={e => {
        let triggerTreshold = 60
        if(e.target.scrollTop + triggerTreshold < e.target.scrollHeight - e.target.offsetHeight){
            setLoadingMore(true)
        }else{
            setLoadingMore(false)
        }
    }}>
        <>
            <h2 className='text-start mb-2 font-bold text-sm text-slate-600'>{
                listTitle
            }</h2>
            {
                (!isLoading && componentData.data.length === 0) &&
                <Paper className='min-h-[100px] flex flex-col items-center mb-4 py-4 px-4' elevation={2}>
                    <FcFolder size={60} />
                    <h4 className='text-sm text-center'>{notFoundList}</h4>
                    {NotFoundButtonComponent &&
                        <NotFoundButtonComponent />}
                </Paper>
            }

            {
                !isLoading ?
                    componentData.data.map((elementProps) => (
                        <React.Fragment key={listTitle+'_'+elementProps.id}>
                            <Component props={{ ...elementProps, ...componentProps }}  />
                        </React.Fragment>
                    ))
                    :
                    <div className='flex justify-center'><CircularProgress /></div>
            }
            {
                isLoadingMore &&
                <div className='flex justify-center'>
                    <CircularProgress size={20}/>
                </div>
            }
            {
                (componentData.current_page === componentData.last_page && componentData.current_page !== 1 && componentData.current_page !== 0 && typeof componentData.current_page !== 'undefined') &&
                <div className='flex justify-center'>
                    <hr />
                    <p>Fim da lista</p>
                </div>
            }
        </>
    </div>
)

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
        NotFoundButtonComponent,
        handleLoadMore,
        ...others
    } = props


    const [isLoadingMore, setLoadingMore] = useState(false)

    useEffect(() => {
        if(!isLoadingMore && componentData.current_page < componentData.last_page){
            handleLoadMore()
        }
    }, [isLoadingMore])


    return (
        <Paper className={`text-xl bg-slate-100 h-[100%]`}>
            {
                !hideSearchBox &&
                <div className='p-2 h-[55px] '>
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

            <List
            setLoadingMore={setLoadingMore}
            listTitle={listTitle}
            isLoading={isLoading}
            componentData={componentData}
            notFoundList={notFoundList}
            NotFoundButtonComponent={NotFoundButtonComponent}
            Component={Component}
            componentProps={componentProps}
            isLoadingMore={isLoadingMore}
            />
        </Paper>
    )
}

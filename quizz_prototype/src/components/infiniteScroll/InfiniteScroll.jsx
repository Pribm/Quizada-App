import { CircularProgress, Paper } from '@mui/material'
import React from 'react'

import InfiniteScroll from 'react-infinite-scroller';


const InfiniteScrollComponent = ({children, title, handleLoadMore, className, current_page, last_page}) => {

    return (
      <Paper className={`bg-slate-100 h-[450px] overflow-auto relative hideScroll w-[100%] ${className}`} >
          <InfiniteScroll
              pageStart={0}
              loadMore={handleLoadMore}
              hasMore={current_page === last_page ? false : true}
              initialLoad={false}
              loader={<div className='flex justify-center relative' key={'loader_friends_0'}>
                  <CircularProgress />
                  </div>}
              useWindow={false}
              
          >
              <h4 className='sticky top-[0px] p-4 text-white mb-4 z-10 bg-blue-400 '>{title}</h4>
              <div className='px-4'>
              {
                 children
              }
              </div>
          </InfiniteScroll>
      </Paper>
    )
}

export default InfiniteScrollComponent
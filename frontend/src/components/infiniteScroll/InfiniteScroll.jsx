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
              loader={
                current_page > 1 ?
                <div className='flex justify-center h-[40px]' key={'loader_friends_0'}>
                  <CircularProgress size={20}/>
                  </div> : ''}
              useWindow={false}
          >
              <h4 className='sticky top-[0px] p-4 text-white z-10 bg-blue-400 '>{title}</h4>
              <div>
              {
                 children
              }
              </div>
          </InfiniteScroll>
      </Paper>
    )
}

export default InfiniteScrollComponent
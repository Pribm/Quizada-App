import * as React from 'react';
import MenuWrapper from 'components/wrappers/MenuWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { index } from 'store/Actions/friends.action';
import { Avatar, CircularProgress, Paper, TextField, Grid } from '@mui/material';
import { getUserThumbnail } from 'utils/getThumbnails';
import { SearchBox } from 'components/searchBox/SearchBox';
import { IoSend } from 'react-icons/io5';
import { makeInvitation } from 'store/Actions/quizz.action';
import { useState } from 'react';
import { changeLoading } from 'store/Actions/loading.action';


const Friends = () => {

  const dispatch = useDispatch()
  const { yourFriends } = useSelector(state => state.friendsReducer)

  const [tokenState, setTokenState] = useState([])
  const [search, setSearch] = useState('')
  const [isSearching, setSearching] = useState(false)

  React.useEffect(() => {
    dispatch(index({ showFriendsList: true }))
  }, [])


  React.useEffect(() => {
    if (isSearching) {
      handleSearching()
    }
  }, [isSearching])



  const handleInputToken = (e, id) => {
    let result = [...yourFriends.data]

    result.map(x => {
      if (x.id === id) x.token = e.target.value;
      return x
    })

    setTokenState(result)
  }

  const handleSearching = () => {
    setSearching(true)
    dispatch(changeLoading({ open: true, text: 'Procurando Usuário...' }))
    dispatch(index({ showFriendsList: true, search: search })).then(() => {
      setSearching(false)
      dispatch(changeLoading({ open: false }))
    })
  }



  return (
    <div className="container mx-auto p-4">
      <Grid container spacing={4} className='justify-center'>
        <Grid item xs={12} md={4}>
          <Paper className='text-xl overflow-y-scroll hideScroll min-h-[calc(100vh-80px-150px)] max-h-[calc(100vh-80px-150px)] relative'>
            <div className='sticky top-0 text-center text-white bg-blue-500 w-[100%] z-10 py-4'>
              Enviar quizz para um amigo
              <div className='mx-4 mt-4'>
                <SearchBox
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onSearch={() => handleSearching()}
                />
              </div>
            </div>
            <div className='p-4'>
              {
                <>
                  {yourFriends.data.length > 0 ?
                    yourFriends.data.map((friend, i) => (
                      <Paper key={'your_friend_' + i} className='min-h-[100px] flex flex-col items-center mb-4 py-4' elevation={2}>
                        <Avatar src={friend.avatar ? getUserThumbnail(friend.avatar, friend.id) : ''} alt={friend.name} className='mr-4' />
                        <p>{friend.name}</p>
                        <p className='text-sm'>{friend.email}</p>
                        <TextField
                          className='mt-2'
                          label='Enviar Token'
                          size='small'
                          onChange={e => handleInputToken(e, friend.id)}
                          value={friend.token || ''}
                          InputProps={{
                            endAdornment: (
                              <IoSend
                                size={20}
                                className='text-blue-500 cursor-pointer'
                                onClick={() => dispatch(makeInvitation(tokenState[i].token, friend.id))}
                              />)
                          }}
                        />
                      </Paper>
                    ))
                    :
                    <div className='flex justify-center'><CircularProgress /></div>
                    }
                </>
              }
            </div>
          </Paper>
        </Grid>
       
        
      </Grid>
    </div>
  );
}

export default MenuWrapper(Friends)
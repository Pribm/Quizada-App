import { Button } from '@mui/material'
import QuizzCard from 'components/quizzCard/QuizzCard'
import { ListWrapper } from 'components/wrappers/ListWrapper'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { quizzFrom as quizzFromAction } from 'store/Actions/user.action'

const NotFoundButton = () => {
  return (
    <Link to='/multiplayer?show_pending=true'>
      <Button variant='contained' size='small' className='mt-2'>
        Ver Quizes Pendentes
      </Button>
    </Link>
  )
}

const ReceivedQuizzInvitations = () => {
  const [isLoading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const { quizzFrom, quizzFrom: { current_page } } = useSelector(state => state.userReducer)
  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(quizzFromAction({}, false)).then(() => setLoading(false))
  }, [])

  const searchHandler = () => {
    setLoading(true)
    dispatch(quizzFromAction({ search: search })).then(() => setLoading(false))
  }

  const handleLoadMore = () => {
    return dispatch(quizzFromAction({ page: current_page + 1 }, true))
  }

  return (
    <div className='h-[calc(100vh-300px)] bg-slate-500'>
      <ListWrapper
        Component={QuizzCard}
        //className={'min-h-[calc(100vh-120px-120px)] max-h-[calc(100vh-120px-120px)]'}
        componentData={quizzFrom}
        componentProps={{ dispatch, hideMakeQuizzButton: true, showUser: true, showInvitationButtons: true }}
        handleLoadMore={handleLoadMore}
        search={search}
        setSearch={setSearch}
        searchHandler={searchHandler}
        isLoading={isLoading}
        setLoading={setLoading}
        searchBoxPlaceholder={'Quiz ou Categoria'}
        listTitle={'Convites de quizes recebidos'}
        notFoundList={'Você não possui nenhum convite de quiz no momento'}
        NotFoundButtonComponent={NotFoundButton}
      />
    </div>
  )
}

export default ReceivedQuizzInvitations
import QuizzCard from 'components/quizzCard/QuizzCard'
import { ListWrapper } from 'components/wrappers/ListWrapper'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { quizzFrom as quizzFromAction } from 'store/Actions/user.action'

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
    dispatch(quizzFromAction({ page: current_page + 1 }, true))
  }

  return (
    <ListWrapper
      Component={QuizzCard}
      className={'min-h-[calc(100vh-120px-120px)] max-h-[calc(100vh-120px-120px)]'}
      componentData={quizzFrom}
      componentProps={{ dispatch, hideMakeQuizzButton: true, showUser: true, showInvitationButtons: true }}
      handleLoadMore={handleLoadMore}
      search={search}
      setSearch={setSearch}
      searchHandler={searchHandler}
      isLoading={isLoading}
      setLoading={setLoading}
      searchBoxPlaceholder={'Quizz ou Categoria'}
      listTitle={'Convites de quizzes recebidos'}
      notFoundList={'Você não possui nenhum convite de quizz no momento'}
    />
  )
}

export default ReceivedQuizzInvitations
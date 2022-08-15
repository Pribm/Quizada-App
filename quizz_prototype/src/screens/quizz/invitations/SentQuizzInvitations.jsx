import QuizzCard from 'components/quizzCard/QuizzCard'
import { ListWrapper } from 'components/wrappers/ListWrapper'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { quizzTo as quizzToAction } from 'store/Actions/user.action'


const SentQuizzInvitations = () => {

  const [isLoading, setLoading] = useState(true)
  const  [search, setSearch] = useState('')

  const {quizzTo, quizzTo: {current_page}} = useSelector(state => state.userReducer)
  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(quizzToAction({}, false)).then(() => setLoading(false))
  }, [])

  const searchHandler = () => {
    setLoading(true)
    dispatch(quizzToAction({search: search})).then(() => setLoading(false))
  }

  const handleLoadMore = () => {
    dispatch(quizzToAction({ page: current_page + 1}, true))
  }

  return (
    <ListWrapper
      Component={QuizzCard}
      className={'min-h-[calc(100vh-120px-120px)] max-h-[calc(100vh-120px-120px)]'}
      componentData={quizzTo}
      componentProps={{ dispatch, hideMakeQuizzButton: true, showInvitation: true }}
      handleLoadMore={handleLoadMore}
      search={search}
      setSearch={setSearch}
      searchHandler={searchHandler}
      isLoading={isLoading}
      setLoading={setLoading}
      searchBoxPlaceholder={'Quizz ou Categoria'}
      listTitle={'Convites de quizzes enviados'}
      notFoundList={'Nenhum Quizz foi encontrado'}
    />
  )
}

export default SentQuizzInvitations

import React, { useEffect, useState } from 'react'

import FinishedQuizzCard from 'components/quizzCard/FinishedQuizzCard'
import { ListWrapper } from 'components/wrappers/ListWrapper'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import { useDispatch, useSelector } from 'react-redux'
import { getQuizzComplete, getQuizzInvitations } from 'store/Actions/user.action'
import QuizzCard from 'components/quizzCard/QuizzCard'
import { useNavigate } from 'react-router-dom'

const FriendQuizz = () => {
  const [isLoading, setLoading] = useState(true)
  const  [search, setSearch] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { quizzInvitations, quizzInvitations: {current_page, last_page} } = useSelector(state => state.userReducer)
  const { quizz: { quizzCreated } } = useSelector(state => state.gameReducer)

  useEffect(() => {
    dispatch(getQuizzInvitations({showAcceptedQuizzList: true}, false)).then(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (quizzCreated) {
      navigate('/quizz', { replace: true })
    }
  }, [quizzCreated])

  const searchHandler = () => {
    setLoading(true)
    dispatch(getQuizzComplete({showCompletedQuizzList: true, search: search})).then(() => setLoading(false))
  }

  const handleLoadMore = () => {
    dispatch(getQuizzInvitations({showAcceptedQuizzList: true, page: current_page + 1}, true))
  }

  return (
    <div className='p-4 md:w-[30vw] mx-auto'>
      <ListWrapper
      Component={QuizzCard}
      componentProps={{dispatch,showUser: true}}
      className={'min-h-[calc(100vh-120px-120px)] max-h-[calc(100vh-120px-120px)]'}
      componentData={quizzInvitations}
      handleLoadMore={handleLoadMore}
      search={search}
      setSearch={setSearch}
      searchHandler={searchHandler}
      isLoading={isLoading}
      setLoading={setLoading}
      searchBoxPlaceholder={'Nome ou categoria'}
      listTitle={'Quizzes pendentes'}
      notFoundList={'Nenhum Quizz foi encontrado'}
      />
    </div>
  )
}

export default FriendQuizz
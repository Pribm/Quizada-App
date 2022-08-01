import FinishedQuizzCard from 'components/quizzCard/FinishedQuizzCard'
import { ListWrapper } from 'components/wrappers/ListWrapper'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getQuizzComplete } from 'store/Actions/user.action'

const Finished = () => {

  const [isLoading, setLoading] = useState(true)
  const  [search, setSearch] = useState('')

  const dispatch = useDispatch()
  const { quizzComplete } = useSelector(state => state.userReducer)

  useEffect(() => {
    dispatch(getQuizzComplete({showCompletedQuizzList: true})).then(() => setLoading(false))
  }, [])

  const searchHandler = () => {
    setLoading(true)
    dispatch(getQuizzComplete({showCompletedQuizzList: true, search: search})).then(() => setLoading(false))
  }

  return (
    <div className='p-4 md:w-[30vw] mx-auto'>
      <ListWrapper
      Component={FinishedQuizzCard}
      className={'min-h-[calc(100vh-120px-120px)] max-h-[calc(100vh-120px-120px)]'}
      componentData={quizzComplete.data}
      search={search}
      setSearch={setSearch}
      searchHandler={searchHandler}
      isLoading={isLoading}
      setLoading={setLoading}
      searchBoxPlaceholder={'Quizzes Concluídos'}
      listTitle={'Ranking de quizzes concluídos'}
      notFoundList={'Nenhum Quizz foi encontrado'}
      />
    </div>
  )
}

export default MenuWrapper(Finished)
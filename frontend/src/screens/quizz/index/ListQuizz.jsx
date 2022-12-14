import MenuWrapper from 'components/wrappers/MenuWrapper'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { index } from 'store/Actions/quizz.action'
import { useNavigate } from 'react-router-dom'
import QuizzCard from 'components/quizzCard/QuizzCard'
import { ListWrapper } from 'components/wrappers/ListWrapper'




const IndexQuestions = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { quizz_list, quizz_list: {current_page} } = useSelector(state => state.quizzReducer)
  const { quizz: { quizzCreated } } = useSelector(state => state.gameReducer)

  const [isLoading, setLoading] = useState(true)
  
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(index()).then(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (quizzCreated) {
      navigate('/quizz', { replace: true })
    }
  }, [quizzCreated])

  const searchHandler = () => {
    setLoading(true)
    dispatch(index({ search: search, page: 1})).then(() => setLoading(false))
  }
  
  const handleLoadMore = () => {
    return dispatch(index({ page: current_page + 1, search}, true))
  }

  return (
    <div className='h-[calc(100vh-300px)] w-auto md:w-[500px] md:mx-auto mx-4'>
      
      <ListWrapper
        Component={QuizzCard}
        componentProps={{dispatch,
          exportQuizzButton: true, 
          deleteQuizzButton: true,
          editQuizzButton: true,
          quizzToken: true,
          showRanking: true,
          showRankingReset: true,
          editQuizzQuestionsButton: true,
          showQuizzInfoButton: true
        }}
        componentData={quizz_list}
        handleLoadMore={handleLoadMore}
        search={search}
        setSearch={setSearch}
        searchHandler={searchHandler}
        isLoading={isLoading}
        setLoading={setLoading}
        searchBoxPlaceholder={'Seus Quizes'}
        listTitle={'Quizes criados por você'}
        notFoundList={'Nenhum quiz foi encontrado'}
      />
    </div>
  )
}

export default MenuWrapper(IndexQuestions)
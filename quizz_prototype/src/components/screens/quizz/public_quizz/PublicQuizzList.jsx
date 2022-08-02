import QuizzCard from 'components/quizzCard/QuizzCard'
import { ListWrapper } from 'components/wrappers/ListWrapper'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getPublicQuizz } from 'store/Actions/user.action'

const PublicQuizzList = () => {

    const [isLoading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { publicQuizz } = useSelector(state => state.userReducer)
    const { quizz: { quizzCreated } } = useSelector(state => state.gameReducer)

    useEffect(() => {
        dispatch(getPublicQuizz({ showAdminQuizzList: true })).then(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (quizzCreated) {
            navigate('/quizz', { replace: true })
        }
    }, [quizzCreated])

    const searchHandler = () => {
        setLoading(true)
        dispatch(getPublicQuizz({ showAdminQuizzList: true, search: search })).then(() => setLoading(false))
    }

    return (
        <div className='p-4 md:w-[30vw] mx-auto'>
            <ListWrapper
                Component={QuizzCard}
                componentProps={{ dispatch, exportQuizzButton: true }}
                className={'min-h-[calc(100vh-120px-120px)] max-h-[calc(100vh-120px-120px)]'}
                componentData={publicQuizz.data}
                search={search}
                setSearch={setSearch}
                searchHandler={searchHandler}
                isLoading={isLoading}
                setLoading={setLoading}
                searchBoxPlaceholder={'Quizzes Públicos'}
                listTitle={'Quizzes de exemplo'}
                notFoundList={'Nenhum Quizz foi encontrado'}
            />
        </div>
    )
}

export default MenuWrapper(PublicQuizzList)
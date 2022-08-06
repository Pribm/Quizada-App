import { Button, Paper } from '@mui/material'
import QuizzCard from 'components/quizzCard/QuizzCard'
import { ListWrapper } from 'components/wrappers/ListWrapper'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import React, { useEffect, useState } from 'react'
import { BiTrash } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { destroy, index } from 'store/Actions/categories.action'


const categoryCard = ({props}) => {
    const {name, id, dispatch} = props

    const handleDelete = id => {
        dispatch(destroy(id))
    }

    return (
        <Paper className='p-4 mb-4 flex items-center'>
            <p className='flex-1'>{name}</p>
            <Button variant='contained' color='error' onClick={() => handleDelete(id)}>
                <BiTrash size={25}/>
            </Button>
        </Paper>
    )
}


const Categories = () => {

    const [isLoading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const dispatch = useDispatch()

    const {categories} = useSelector(state => state.categoriesReducer)

    useEffect(() => {
        dispatch(index({user_categories: true})).then(() => setLoading(false))
    }, [])


    const searchHandler = () => {
        setLoading(true)

        // dispatch(getQuizzComplete({ showCompletedQuizzList: true, search: search })).then(() => setLoading(false))
    }

    const handleLoadMore = () => {

      }

    return (
        <div className='p-4 md:w-[30vw] mx-auto'>
            <ListWrapper
                Component={categoryCard}
                hideSearchBox={true}
                componentProps={{ dispatch }}
                className={'min-h-[calc(100vh-120px-120px)] max-h-[calc(100vh-120px-120px)]'}
                componentData={categories}
                search={search}
                setSearch={setSearch}
                searchHandler={searchHandler}
                handleLoadMore={handleLoadMore}
                isLoading={isLoading}
                setLoading={setLoading}
                searchBoxPlaceholder={'Nome da categoria'}
                listTitle={'Lista de Categorias'}
                notFoundList={'Nenhuma categoria foi encontrada'}
            />
        </div>
    )
}

export default MenuWrapper(Categories)
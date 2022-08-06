import { ListWrapper } from 'components/wrappers/ListWrapper'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUsersForAdm } from 'store/Actions/user.action';
import FriendCard from 'components/friendsCards/FriendCard';

const PanelAdmin = () => {

  const [isLoading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const {users_for_adm, users_for_adm: {current_page}}  = useSelector(state => state.userReducer)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUsersForAdm()).then(() => setLoading(false))
}, [])

const searchHandler = () => {
  setLoading(true)
  dispatch(getUsersForAdm({  search: search })).then(() => setLoading(false))
}

const handleLoadMore = () => {
  dispatch(getUsersForAdm({ page: current_page + 1}, true))
}

  return (
    <div className='p-4 md:w-[30vw] mx-auto'>

      <ListWrapper
        Component={FriendCard}
        className={'min-h-[calc(100vh-120px-120px)] max-h-[calc(100vh-120px-120px)]'}
        componentData={users_for_adm}
        componentProps={{ dispatch}}
        handleLoadMore={handleLoadMore}
        search={search}
        setSearch={setSearch}
        searchHandler={searchHandler}
        isLoading={isLoading}
        setLoading={setLoading}
        searchBoxPlaceholder={'Procurar Usuário'}
        listTitle={'Usuários da plataforma'}
        notFoundList={'Nenhum Usuário foi encontrado'}
      />
    </div>
  )
}

export default MenuWrapper(PanelAdmin)
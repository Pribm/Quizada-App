import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import {useDispatch} from 'react-redux'
import { index } from 'store/Actions/user.action'

const ProtectedRoutes = () => {

    const navigate = useNavigate()
    const isAuthenticated = localStorage.getItem('access_token')

    const dispatch = useDispatch()

    React.useEffect(() => {
        if(!isAuthenticated) {
            navigate('/', {replace: true})
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated])

    React.useEffect(() => {
      dispatch(index())
    }, [])

  return (
    (isAuthenticated) && <Outlet/>
  )
}

export default ProtectedRoutes
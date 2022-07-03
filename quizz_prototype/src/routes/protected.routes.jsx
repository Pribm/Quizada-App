import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const ProtectedRoutes = () => {

    const navigate = useNavigate()

    const isAuthenticated = localStorage.getItem('access_token')

    React.useEffect(() => {
        if(!isAuthenticated) {
            navigate('/', {replace: true})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated])

  return (
    isAuthenticated && <Outlet/>
  )
}

export default ProtectedRoutes
import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

const AdminRoutes = () => {

    const navigate = useNavigate()
    const {user} = useSelector(state => state.userReducer)

    const isAdmin = user.role_id === 1

    React.useEffect(() => {
        if(!isAdmin) {
            navigate('/home', {replace: true})
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin])

  return (
    (isAdmin) && <Outlet />
  )
}

export default AdminRoutes
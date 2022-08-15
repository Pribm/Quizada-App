import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { getNotifications, index } from 'store/Actions/user.action'

const ProtectedRoutes = () => {

  const navigate = useNavigate()
  const isAuthenticated = localStorage.getItem('access_token')

  const dispatch = useDispatch()
  const [refreshFlag, setRefreshFlag] = React.useState(false)
  let refreshTime = 15000

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true })
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  React.useEffect(() => {
    dispatch(index())
    setTimeout(() => {
      fetchNotifications()
    }, 0)
  }, [])


  React.useEffect(() => {
    if (refreshFlag === true) {
      const interval = setInterval(() => fetchNotifications(), refreshTime)
      return () => clearInterval(interval);
    }
  }, [refreshFlag]);

  const fetchNotifications = () => {
    setRefreshFlag(true)
    dispatch(getNotifications())
  }

  return (
    (isAuthenticated) && <Outlet />
  )
}

export default ProtectedRoutes
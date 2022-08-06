import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { change } from 'store/Actions/rules.action'
import CreateQuizzStep1 from './CreateQuizzStep_1'
import CreateQuizzStep2 from './CreateQuizzStep_2'

const CreateQuizzHub = () => {

  const dispatch= useDispatch()
  const {creatingNewQuizz, success} = useSelector(state => state.quizzReducer)

  useEffect(() => {
    dispatch(change({open: true}))
  },[])
  
  return (
        <>
          
          {success === true && <Navigate to='/success/upload'/>}
          {!creatingNewQuizz ?
          <CreateQuizzStep1/>
          :
          <CreateQuizzStep2/>}
        </>
  )
}

export default CreateQuizzHub
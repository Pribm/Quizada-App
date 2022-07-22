import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import CreateQuizzStep1 from './CreateQuizzStep_1'
import CreateQuizzStep2 from './CreateQuizzStep_2'

const CreateQuizzHub = () => {
    const {creatingNewQuizz, success} = useSelector(state => state.quizzReducer)

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
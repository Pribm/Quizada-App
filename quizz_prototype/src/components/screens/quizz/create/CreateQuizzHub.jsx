import React from 'react'
import { useSelector } from 'react-redux'
import CreateQuizzStep_1 from './CreateQuizzStep_1'
import CreateQuizzStep_2 from './CreateQuizzStep_2'

const CreateQuizzHub = () => {
    const {creatingNewQuizz} = useSelector(state => state.quizzReducer)

  return (
    
        !creatingNewQuizz ?
        <CreateQuizzStep_1/>
        :
        <CreateQuizzStep_2/>
    
  )
}

export default CreateQuizzHub
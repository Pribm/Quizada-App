import React, { useEffect, useState } from 'react'

import Question from './Question'
import Result from './Result'
import Answers from './Answers'

import {useDispatch, useSelector} from 'react-redux'
import { change } from 'store/Actions/quizz.action'
import { HttpAuth } from 'config/Http'

const Quizz = () => {

    const [currentQuestion, setCurrentQuestion] = useState(0)

    const [answer, setAnswer] = useState('')
    const [correctAnswers, setCorrectAnswers] = useState([])
    const [wrongAnswers, setWrongAnswers] = useState([])

    const [showresults, setShowResults] = useState(false)
    const [viewAnswers, setViewAnswers] = useState(false)

    const [isLoading, setLoading] = useState(true)

    const dispatch = useDispatch()

    const {questions} = useSelector(state => state.quizzReducer)

    useEffect(() => {
        getQuestions()

        return () => setLoading(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getQuestions = () => {
        HttpAuth.get('question/list').then(res => {
            setLoading(false)
            dispatch(change({questions: res.data}))
        })
    }

    const handleAnswer = () => {

        if(answer === questions[currentQuestion].correct_answer){
            setCorrectAnswers([...correctAnswers, {question: questions[currentQuestion].question, answer: answer}])
        }else{
            setWrongAnswers([...wrongAnswers, {question: questions[currentQuestion].question, answer: answer}])
        }
        

        if (answer === '') {
            return alert('you must provide at least a answer')
        }

        if (currentQuestion + 1 > questions.length - 1) {
            setShowResults(true)
            return
        }
        setAnswer('')
        setCurrentQuestion(currentQuestion + 1)
    }

        const handleRestart = () => {
            getQuestions()
            setCurrentQuestion(0)
            setCorrectAnswers([])
            setWrongAnswers([])
            setShowResults(false)
            setViewAnswers(false)
        }

    return (

        <div className='quizz'>
            {questions.length > 0 &&
                <div className="quizz__container">
                    {(!showresults && !viewAnswers) &&
                        <Question
                        isLoading={isLoading}
                        questions={questions}
                        currentQuestion={currentQuestion}
                        setAnswer={setAnswer}
                        handleAnswer={handleAnswer}
                    />
                    }

                    {showresults && 
                    <Result restart={handleRestart} correctAnswers={correctAnswers} setViewAnswers={setViewAnswers} viewAnswers={viewAnswers} setShowResults={setShowResults}/>
                    }

                    {(viewAnswers === true) &&
                        <Answers correct={correctAnswers} wrong={wrongAnswers} setShowResults={setShowResults} setViewAnswers={setViewAnswers}/>
                    }
                </div>
            }
        </div>
    )
}

export default Quizz
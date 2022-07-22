import React, { useEffect } from 'react'

import Question from './Question'
import Result from './Result'

import {useDispatch, useSelector} from 'react-redux'

import { index } from 'store/Actions/categories.action'
import { answerQuestion, change } from 'store/Actions/game.action'
import {change as changeTimer} from 'store/Actions/timer.action'

import QuizzRules from './QuizzRules'

const Quizz = () => {

    const dispatch = useDispatch()

    const { 
        questions,
        quizz: {
            answer,
            withTime,
            scoreModifier,
            currentQuestion,
            quizzCreated,
            quizzComplete
        },
    } = useSelector(state => state.gameReducer)

    const {remainingTime} = useSelector(state => state.timerReducer)

    useEffect(() => {
        dispatch(index())
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => dispatch(change('clear'))
    }, [])

    const handleAnswer = () => { 
        //End of the game
        let withTimeScore = withTime ? Math.round(remainingTime * scoreModifier) + 1 : 1
        let timeUpScore = withTime && remainingTime <= 0 ? 0 : withTimeScore
        let score = withTime ? withTimeScore : timeUpScore

        dispatch(answerQuestion({
            question: questions[currentQuestion].question,
            correct_answer: questions[currentQuestion].correct_answer,
            answer: answer,
            score: score,
            remainingTime,
            scoreModifier
        }))

        dispatch(change({ currentQuestion: currentQuestion + 1 }))
        
        if(withTime){
            dispatch(changeTimer({resetTimer: true}))
        }

        if(currentQuestion+1 === questions.length){
            dispatch(change({ quizzComplete: true, answer: '' }))
        }
    }

    const handleRestart = () => {
        console.log('restart')
    }

    return (
        <>
            {
                !quizzCreated ?
                <QuizzRules />
                :
                questions.length > 0 &&
                <div className="quizz__container">
                    {(!quizzComplete) ?
                        <Question handleAnswer={handleAnswer}/>
                        :
                        <Result
                        totalQuestions={questions.length}
                        restart={handleRestart}/>
                    }
                </div>
            }
        </>
    )
}

export default Quizz
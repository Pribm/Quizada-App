import React, { useEffect } from 'react'
import { useTimer } from 'use-timer';
import { useSelector, useDispatch } from 'react-redux';
import { change } from 'store/Actions/timer.action';

const Timer = ({initialTime, timerText}) => {

    const dispatch = useDispatch()
    const {endTime, resetTimer} = useSelector(state => state.timerReducer)

    const { time: timerHookState, start, reset, status } = useTimer({
        initialTime: initialTime,
        endTime: endTime,
        timerType: 'DECREMENTAL',
        onTimeUpdate: (t) => dispatch(change({elapsedTime: (t-initialTime)*-1, remainingTime: t})),
    });

    useEffect(() => {
        start()
    }, [])

    useEffect(() => {
        if(resetTimer){
            reset()
            dispatch(change({resetTimer: false}))
            start()
        }
    }, [resetTimer])



  return (
    <div
    className='text-center'
    >
        <h4>{timerText}</h4>
        {status === 'RUNNING'}
        <h4 className='text-2xl'>{`${Math.floor(timerHookState/60)}:${timerHookState - Math.floor(timerHookState/60) * 60}`}</h4>
    </div>
  )
}

export default Timer
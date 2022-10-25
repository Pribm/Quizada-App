import React, { useState } from 'react'

import { FormControl, FormControlLabel, FormGroup, FormHelperText, Slider, Switch, Typography } from '@mui/material'
import Dialog from 'components/dialog/Dialog'
import { useDispatch, useSelector } from 'react-redux'
import { create, change } from 'store/Actions/game.action'

import { useNavigate } from 'react-router-dom'
import CategorySelector from 'components/categorySelector/CategorySelector'
import { changeAlert } from 'store/Actions/alert.action'
import { change as changeCategory } from 'store/Actions/categories.action'

const QuizzRules = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {category: {id} } = useSelector(state => state.categoriesReducer)

    React.useEffect(() => {
        dispatch(changeCategory('clear'))
    }, [])
    

    const [rules, setRules] = useState({
        limit_questions: 10,
        withTime: false,
        time_per_question: 0,
        random_questions: true,
        immediate_show_wrong_answers: 0,
        category_id:0,
        shuffle_answers: true,
        shuffle_questions: true,
        count_time: 'none'
    })

    const handleCreateQuizz = () => {
        if(rules.category_id !== 0){
            dispatch(create(rules)).then(() => dispatch(change({ quizzCreated: true })))
            return
        }
        dispatch(changeAlert({class: 'error', msg: 'Você precisa fornecer ao menos uma categoria', open: true}))
    }


    return (
        <div className='min-w[100vw] min-h-[100vh] bg-sky-600'>
            <Dialog
                open={true}
                dialogtitle='Escolha o quiz de acordo com suas preferências'
                dialogcontenttext='Escolha as opções abaixo para a geração do seu quizz'
                actionButtonText='Confirmar'
                handleConfirm={handleCreateQuizz}
                handleClose={() => navigate('/home', { replace: true })}
            >
                <hr className='mt-4 mb-4' />
                <FormControl fullWidth>
                    <FormGroup>
                        <Typography id="input-slider" gutterBottom>
                            Número de questões
                        </Typography>
                        <Slider
                            aria-label="input-slider"
                            min={10}
                            max={100}
                            step={5}
                            value={rules.limit}
                            onChange={e => setRules(({ ...rules, limit: e.target.value }))}
                            valueLabelDisplay="on"
                            className='mt-8 w-[90%] mx-auto'
                        />
                    </FormGroup>

                    <Typography id="category-selector" className='mt-4'>
                        Selecione a categoria
                    </Typography>
                   <CategorySelector
                   categorySelectorQuery={{getAdmCategoriesWithQuestions: true}}
                   category={id}
                   changeHandler={e => setRules({...rules, category_id: e.target.value}) }/>
                    <FormGroup className='mt-4'>
                        <FormControlLabel
                            control={
                                <Switch
                                checked={Boolean(rules.withTime)}
                                onChange={() => setRules({ ...rules, withTime: !rules.withTime, time_per_question: Boolean(rules.withTime) ?  0 : 30 })} />
                            }
                            label="Deseja que as questões tenham tempo?"
                        />
                        <FormHelperText>A sua pontuação será baseada no tempo</FormHelperText>
                    </FormGroup>

                    <FormGroup className='mt-4'>
                        <FormControlLabel
                            control={
                                <Switch
                                checked={Boolean(rules.immediate_show_wrong_answers)}
                                onChange={() => setRules({ ...rules, immediate_show_wrong_answers: rules.immediate_show_wrong_answers ? false : true})} />
                            }
                            label="Mostrar a resposta Imediatamente?"
                        />
                        <FormHelperText>As suas respostas serão exibidas ao fim de cada quizz.</FormHelperText>
                    </FormGroup>

                    {
                        rules.withTime &&
                        <>

                            <FormGroup>
                                <Typography id="input-slider" gutterBottom>
                                    Tempo para resolver as questões
                                </Typography>
                                <Slider
                                    aria-label="input-slider"
                                    min={30}
                                    max={90}
                                    value={rules.time_per_question}
                                    onChange={e => {
                                        let modifier = .3;
                                        if (e.target.value === 30) {
                                            modifier = .3
                                        } else if (e.target.value === 60) {
                                            modifier = .2
                                        } else if (e.target.value === 90) {
                                            modifier = .1
                                        } else {
                                            modifier = .3
                                        }
                                        dispatch(change({ scoreModifier: modifier }))
                                        setRules({ ...rules, time_per_question: e.target.value })
                                    }}
                                    step={30}
                                    valueLabelDisplay="on"
                                    className='mt-8 w-[90%] mx-auto'
                                    valueLabelFormat={(v) => `${v} ${'Seg.'}`}
                                />
                            </FormGroup>
                            <FormHelperText>
                                O tempo
                                {' de cada questão será de ' + rules.time_per_question + ' segundos'}
                            </FormHelperText>
                        </>
                    }

                </FormControl>
            </Dialog>
        </div>
    )
}

export default QuizzRules
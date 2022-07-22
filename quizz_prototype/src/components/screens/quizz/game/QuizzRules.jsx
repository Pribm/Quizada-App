import React, { useState } from 'react'

import { FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, MenuItem, Radio, RadioGroup, Select, Slider, Switch, Typography } from '@mui/material'
import Dialog from 'components/dialog/Dialog'
import { useSelector, useDispatch } from 'react-redux'
import { create, change } from 'store/Actions/game.action'

import { useNavigate } from 'react-router-dom'

const QuizzRules = () => {

    const dispatch = useDispatch()
    const {categories} = useSelector(state => state.categoriesReducer) 

    const navigate = useNavigate()

    const [rules, setRules] = useState({
        limit: 10,
        category_id: 0,
        withTime: false,
        time_per_question: 30,
        random_questions: true
    })

    const handleCreateQuizz = () => {
        dispatch(create(rules)).then(() => dispatch(change({quizzCreated: true})))
    }


  return (
    <div className='min-w[100vw] min-h-[100vh] bg-sky-600'>
                    <Dialog
                        open={true}
                        dialogTitle='Escolha o quizz de acordo com suas preferências'
                        dialogContentText='Escolha as opções abaixo para a geração do seu quizz'
                        actionButtonText='Confirmar'
                        handleConfirm={handleCreateQuizz}
                        handleClose={() => navigate('/home', {replace: true})}
                    >
                        <hr className='mt-4 mb-4'/>
                        <FormControl fullWidth>
                            <FormGroup>
                                <Typography id="input-slider" gutterBottom>
                                    Número de questões
                                </Typography>
                                <Slider
                                    aria-label="input-slider"
                                    min={10}
                                    max={100}
                                    step={10}
                                    value={rules.limit}
                                    onChange={e => setRules(({...rules, limit: e.target.value}))}
                                    valueLabelDisplay="on"
                                    className='mt-8 w-[90%] mx-auto'
                                />
                            </FormGroup>

                            <Typography id="category-selector" className='mt-4'>
                                Selecione a categoria
                            </Typography>
                            <Select
                            size='small'
                            value={rules.category_id}
                            onChange={e => setRules(({...rules, category_id: e.target.value}))}
                            >
                                <MenuItem value={0}>
                                --------------------------------------------
                                </MenuItem>
                                {
                                    categories?.map(({name, id}, i) => (
                                        <MenuItem value={id} key={`category_select_${i}`}>
                                            {name}
                                        </MenuItem>
                                    ))
                                }
                            </Select>

                            <FormGroup className='mt-4'>
                                <FormControlLabel
                                control={
                                    <Switch checked={Boolean(rules.withTime)} onChange={() => setRules({...rules, withTime: rules.withTime ? false : true})}/>
                                }
                                label="Deseja que as questões tenham tempo?"
                                />
                                <FormHelperText>A sua pontuação será baseada no tempo</FormHelperText>
                            </FormGroup>

                            {
                                rules.withTime &&
                                <>
                                <FormGroup className='mt-4'>
                                    <FormLabel id="demo-row-radio-buttons-group-label">
                                        Como você deseja que o tepo seja contado?
                                    </FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        value={rules.withTime}
                                        onChange={e => {
                                            setRules({...rules, withTime: e.target.value})
                                        }}
                                    >
                                        <FormControlLabel value={1} control={<Radio />} label="Entre as questões" />
                                        <FormControlLabel value={2} control={<Radio />} label="Para todas as questões" />
                                    </RadioGroup>
                                </FormGroup>

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
                                            if(e.target.value === 30){
                                                modifier = .3
                                            }else if(e.target.value === 60){
                                                modifier = .2
                                            }else if(e.target.value === 90){
                                                modifier = .1
                                            }else{
                                                modifier = .3
                                            }
                                            dispatch(change({scoreModifier: modifier}))
                                            setRules({...rules, time_per_question: e.target.value})
                                        }}
                                        step={30}
                                        valueLabelDisplay="on"
                                        className='mt-8 w-[90%] mx-auto'
                                        valueLabelFormat={(v) => `${v} ${'Seg.'}`}
                                    />
                                </FormGroup>
                                <FormHelperText>
                                    O tempo 
                                    {parseInt(rules.withTime) === 1 && ' de cada questão será de '+rules.time_per_question+' segundos'} 
                                    {parseInt(rules.withTime) === 2 && ' total do quizz será de '+(rules.time_per_question * rules.limit / 60).toFixed(2)+' minutos'}
                                </FormHelperText>
                            </>
                            }

                        </FormControl>
                    </Dialog>
                </div>
  )
}

export default QuizzRules
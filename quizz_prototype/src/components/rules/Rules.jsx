import React from 'react'

import { Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Radio, RadioGroup, Slider, Switch, TextField, Typography } from '@mui/material'
import Dialog from 'components/dialog/Dialog'
import { useSelector, useDispatch } from 'react-redux'
import { change } from 'store/Actions/rules.action'
import NumberFormat from 'react-number-format';

import { useNavigate } from 'react-router-dom'

const NumberField = React.forwardRef(function NumberField(props, ref) {

    const MIN_VAL = 1;

    const withValueCap = (inputObj) => {
        const { value } = inputObj;
        if (value >= MIN_VAL) return true;
        return false;
      };

    const { onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            isAllowed={withValueCap}
            allowLeadingZeros={false}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
        />
    );
});

const Rules = () => {

    const dispatch = useDispatch()
    const { open, cancelState, rules } = useSelector(state => state.rulesReducer)
    const navigate = useNavigate()

    return (

        <Dialog
            open={open}
            dialogtitle='Escolha o quizz de acordo com suas preferências'
            dialogcontenttext='Escolha as opções abaixo para a geração do seu quizz'
            actionButtonText='Confirmar'
            handleConfirm={() => dispatch(change({open: false}))}
            handleClose={() => {
                if(cancelState === 'goToHome'){
                    navigate('/home', { replace: true })
                    dispatch(change({open: false}))
                }else{
                    dispatch(change({open: false}))
                }
            }}
        >
            <hr className='mt-4 mb-4' />
            <FormControl fullWidth>
                <FormGroup>
                    <   FormControlLabel
                        control={
                            <Switch checked={Boolean(rules.limitNumQuestions)} onChange={() => dispatch(change({ rules: { ...rules, limitNumQuestions: !rules.limitNumQuestions } }))} />
                        }
                        label="Deseja limitar a quantidade de questões criadas?"
                    />
                    <FormHelperText>Você não poderá criar mais questões que a quantidade que delimitar, opção útil para criar quizzes extensos</FormHelperText>
                    {
                        rules.limitNumQuestions &&
                        <>
                            <Typography id="input-slider" gutterBottom>
                                Número de questões
                            </Typography>
                            <TextField
                                autoComplete='false'
                                type="text"
                                size='small'
                                className='mt-2'
                                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                label='Número de questões'
                                value={rules.numQuestions}
                                onChange={e => dispatch(change({ rules: { ...rules, numQuestions: e.target.value } }))}
                                name="numberformat"
                                InputProps={{
                                    inputComponent: NumberField,
                                }}
                            />
                        </>
                    }
                </FormGroup>

                <FormGroup className='mt-4'>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={Boolean(rules.immediate_show_wrong_answers)}
                                onChange={() => dispatch(change({ rules: { ...rules, immediate_show_wrong_answers: rules.immediate_show_wrong_answers ? false : true }}))} />
                        }
                        label="Mostrar a resposta Imediatamente?"
                    />
                    <FormHelperText>As suas respostas serão exibidas ao fim de cada quizz.</FormHelperText>
                </FormGroup>

                <FormGroup className='mt-4'>
                    <FormControlLabel
                        control={
                            <Switch checked={Boolean(rules.withTime)} onChange={() => {
                                dispatch(change({ rules: { ...rules, withTime: !rules.withTime, count_time: rules.withTime ? 0 : 1, time_per_question: rules.withTime ? 0 : 30 } }))
                            }} />
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
                                value={rules.count_time}
                                onChange={e => {
                                    dispatch(change({ rules: { ...rules, count_time: e.target.value } }))
                                }}
                            >
                                <FormControlLabel value={1} control={<Radio />} label="Entre as questões" />
                                <FormControlLabel value={2} control={<Radio />} label="Para todas as questões" />
                            </RadioGroup>
                        </FormGroup>

                        <FormGroup>
                            <Typography id="input-timer" gutterBottom>
                                Tempo para resolver as questões
                            </Typography>
                            <TextField
                                autoComplete='false'
                                type="text"
                                size='small'
                                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                label={`Tempo em ${rules.count_time == 1 ? 'segundos' : 'minutos'}`}
                                helperText={`${rules.count_time == 1 ? 'Este tempo será contado entre cada questão'
                                    :
                                    'Este tempo será contado para todo o quizz'}`}
                                value={rules.time_per_question}
                                onChange={e => {
                                    dispatch(change({ rules: { ...rules, time_per_question: parseInt(e.target.value) } }))
                                }}
                                name="numberformat"
                                className='mt-2'
                                InputProps={{
                                    inputComponent: NumberField,
                                }}
                            />
                        </FormGroup>
                    </>
                }
                <Divider className='mt-4' />
                <FormGroup
                    className='mt-4'
                >
                    <   FormControlLabel
                        control={
                            <Switch checked={Boolean(rules.shuffle_questions)} onChange={() => dispatch(change({ rules: { ...rules, shuffle_questions: !rules.shuffle_questions } }))} />
                        }
                        label="Embaralhar ordem das perguntas do quizz"
                    />
                    <   FormControlLabel
                        control={
                            <Switch checked={Boolean(rules.shuffle_answers)} onChange={() => dispatch(change({ rules: { ...rules, shuffle_answers: !rules.shuffle_answers } }))} />
                        }
                        label="Embaralhar ordem das Respostas do quizz"
                    />
                </FormGroup>

            </FormControl>
        </Dialog>

    )
}

export default Rules
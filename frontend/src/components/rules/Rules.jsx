import React from 'react'

import { CircularProgress, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Radio, RadioGroup, Slider, Switch, TextField, Typography } from '@mui/material'
import Dialog from 'components/dialog/Dialog'
import { useSelector, useDispatch } from 'react-redux'
import { change, show, update } from 'store/Actions/rules.action'
import NumberFormat from 'react-number-format';

import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useState } from 'react'
import CategorySelector from 'components/categorySelector/CategorySelector'
import { changeConfirm } from 'store/Actions/confirm.action'
import { changeAlert } from 'store/Actions/alert.action'

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
    const { open, rules, state, quizzToken } = useSelector(state => state.rulesReducer)
    const { quizz } = useSelector(state => state.quizzReducer)
    const { user: { role_id } } = useSelector(state => state.userReducer)

    const navigate = useNavigate()

    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        if(state === 'edit'){
            dispatch(show(quizzToken)).then(() => setLoading(false))

            if(open === false){
                dispatch(changeConfirm('clear'))
                dispatch(change('clear'))
            }
        }


        return () => setLoading(true)
    }, [state, open])

    return (

        <Dialog
            open={open}
            dialogtitle={`${state === 'create' ? 'Escolha' : 'Edite'} o quiz de acordo com suas prefer??ncias.`}
            dialogcontenttext={state === 'create' ? 'Escolha as op????es abaixo para a gera????o do seu quiz' : 'Selecione as op????es abaixo para atualizar seu quiz'}
            actionButtonText='Confirmar'
            handleConfirm={() => {
                if(state === 'create'){

                   if((rules.limit_questions > quizz.length) && rules.limitNumQuestions === true){
                       dispatch(changeAlert(
                           {
                               autoHideDuration: 13000,
                               open: true,
                               class: 'error',
                               msg: `Voc?? possui ${quizz.length} perguntas nesse quizz, o limite n??o pode ser inferior ao tamanho das perguntas. Caso este seja um novo quiz, crie sem limite e depois altere o limite nas configura????es.`
                           })
                       )
                    return
                   }
                    dispatch(change({open: false}))
                }else{
                   dispatch(changeConfirm({
                    open: true,
                    msg: 'Caso o quiz seja alterado, o ranking ser?? reiniciado.',
                    confirmAction: () => dispatch(update(rules.id, rules)).then(() => {
                        dispatch(changeConfirm({open: false}))
                    })}))
                }
            }}
            handleClose={() => {
                if(state === 'create'){
                    navigate('/home', { replace: true })
                }
                dispatch(change('clear'))
            }}
        >
            <hr className='mt-4 mb-4' />
            {
                (isLoading && state !== 'create') ?
                <div className='flex justify-center'>
                    <CircularProgress size={30}/>
                </div>
                :
                <FormControl fullWidth>
                {
                    state === 'edit' ?
                    <>

                        <FormGroup>
                            <Typography id="input-quizz-data" gutterBottom>
                                Dados do quiz
                            </Typography>
                            <TextField size='small' value={rules?.title} onChange={e => dispatch(change({rules:{title: e.target.value}}))} label='T??tulo' className='mt-2' />
                            <CategorySelector
                            className='mt-2'
                            category={rules.category_id}
                            changeHandler={e => dispatch(change({rules:{category_id: e.target.value}}))}
                            />

                            <TextField
                            label='descri????o'
                            value={rules?.description}
                            onChange={e => dispatch(change({rules:{description: e.target.value}}))}
                            id="description"
                            multiline
                            fullWidth
                            rows={5}
                           className='mt-3' />
                        </FormGroup>
                        <hr className='mt-4 mb-4' />
                    </>
                    :
                    ''
                }

                {
                    role_id === 1 &&
                    <>
                        <FormGroup >
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={Boolean(rules.public_quizz)}
                                        onChange={() => dispatch(change({ rules: { ...rules, public_quizz: rules.public_quizz ? false : true } }))} />
                                }
                                label="Este quiz ser?? p??blico?"
                            />
                            <FormHelperText>Como voc?? ?? um adm, voc?? poder?? disponibilizar este quiz para outros usu??rios.</FormHelperText>
                        </FormGroup>
                        <hr className='my-4'/>
                    </>
                }

                <FormGroup>
                    <   FormControlLabel
                        control={
                            <Switch checked={Boolean(rules.limitNumQuestions) || rules.limit_questions > 0} onChange={() => dispatch(change({ rules: { ...rules, limitNumQuestions: !rules.limitNumQuestions, limit_questions:  rules.limitNumQuestions > 0 ? 0 : 1} }))} />
                        }
                        label="Deseja limitar a quantidade de quest??es criadas?"
                    />
                    <FormHelperText>
                        Voc?? pode inserir v??rias quest??es, e limitar a quantidade de quest??es para o quiz. Por exemplo: Voc?? pode inserir 100 quest??es para esse quiz e limitar a 10 por jogo. As 10 quest??es ser??o escolhidas aleat??riamente entre as 100.
                    </FormHelperText>
                    {
                        (rules.limitNumQuestions || rules.limit_questions > 0) &&
                        <>
                            <Typography id="input-slider" gutterBottom>
                                N??mero de quest??es
                            </Typography>
                            <TextField
                                autoComplete='false'
                                type="text"
                                size='small'
                                className='mt-2'
                                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                label='N??mero de quest??es'
                                value={rules.limit_questions}
                                onChange={e => dispatch(change({ rules: { ...rules, limit_questions: e.target.value } }))}
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
                    <FormHelperText>As suas respostas ser??o exibidas ao fim de cada quizz.</FormHelperText>
                </FormGroup>

                <FormGroup className='mt-4'>
                    <FormControlLabel
                        control={
                            <Switch checked={Boolean(rules.withTime)} onChange={() => {
                                dispatch(change({ rules: { ...rules, withTime: !rules.withTime, count_time: rules.withTime ? 'none' : 'seconds', time_per_question: rules.withTime ? 0 : 30 } }))
                            }} />
                        }
                        label="Deseja que as quest??es tenham tempo?"
                    />
                    <FormHelperText>A sua pontua????o ser?? baseada no tempo</FormHelperText>
                </FormGroup>

                {
                    rules.withTime ?
                    <>
                        <FormGroup className='mt-4'>
                            <FormLabel id="demo-row-radio-buttons-group-label">
                                Como voc?? deseja que o tepo seja contado?
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
                                <FormControlLabel value={'seconds'} control={<Radio />} label="Entre as quest??es" />
                                <FormControlLabel value={'minutes'} control={<Radio />} label="Para todas as quest??es" />
                            </RadioGroup>
                        </FormGroup>

                        <FormGroup>
                            <Typography id="input-timer" gutterBottom>
                                Tempo para resolver as quest??es
                            </Typography>
                            <TextField
                                autoComplete='false'
                                type="text"
                                size='small'
                                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                label={`Tempo em ${rules.count_time == 'seconds' ? 'segundos' : 'minutos'}`}
                                helperText={`${rules.count_time == 1 ? 'Este tempo ser?? contado entre cada quest??o'
                                    :
                                    'Este tempo ser?? contado para todo o quizz'}`}
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
                    :
                    ''
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
            }
        </Dialog>

    )
}

export default Rules
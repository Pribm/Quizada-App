import { Grid, Paper, Typography, TextField, FormControl, Button } from '@mui/material'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import { useFormik } from 'formik'
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { IoImage } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { changeAlert } from 'store/Actions/alert.action'
import { store, success as questionsSuccess } from 'store/Actions/questions.action'
import { change } from 'store/Actions/quizz.action'

import { questionFormSchema } from './validation/questionFormValidation'

const CreateQuestions = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const {success} = useSelector(state => state.questionsReducer)
    
    const {newQuizz, creatingNewQuizz}= useSelector(state => state.quizzReducer)

    const [questionsList, setQuestionsList] = useState([])
    const [currQuestion, setCurrQuestion] = useState(0)
    const [questionImageThumb, setQuestionImageThumb] = useState('')
    const [createQuizz, setCreateQuizz] = useState(false)

    const questionImageRef = useRef(null)

    useEffect(() => {
        if(createQuizz){
            setCreateQuizz(location.state.createQuizz)
        }
    }, [createQuizz])

    useEffect(() => {
        if(success){
            if(creatingNewQuizz){
                dispatch(change({creatingNewQuizz: false}))
                navigate('/quizz/list', {replace:true})
            }else{
                navigate('/questions', {replace:true})
            }
        }
        
        return () => dispatch(questionsSuccess(false))
    }, [success])

    const {
        values: {
            question,
            answer_2,
            answer_3,
            answer_4,
            answer_5,
            correct_answer
        },
        values,
        setValues,
        setFieldValue,
        errors,
        resetForm,
        validateForm
    } = useFormik({
        initialValues: {
            image: '',
            question: '',
            answer_1:'',
            answer_2:'',
            answer_3:'',
            answer_4:'',
            answer_5:'',
            correct_answer: ''
        },
        validationSchema: questionFormSchema,
        validateOnChange: false,
    })

    const handleSubmitData = () => {
        const formData = new FormData()
        formData.append('createQuizz', createQuizz)
        questionsList.forEach((questionObj, i) => {
            Object.keys(questionObj).forEach(att => {
                if(questionObj[att] instanceof File){
                    formData.append(`question_image_${i}`, questionObj[att])
                }
            })
            formData.append(`questions[${i}]`, JSON.stringify(questionObj))
        })

        Object.keys(newQuizz).forEach((rule) => {
            formData.append(rule, newQuizz[rule])
        })
       dispatch(store(formData))
    }

    const handleQuestionList = option => {
        if(option === 'increase'){
            validateForm().then(errors => {
                //Se não tiver nenhum erro
                if (Object.keys(errors).length <= 0) {
                    //se não houver outra pergunta, aumenta mais uma
                    if(questionsList.length === currQuestion){
                        setQuestionsList(old => [...old, values])
                        setCurrQuestion(currQuestion + 1)
                        setQuestionImageThumb(null)
                        resetForm()
                    }
                    
                    if(questionsList.length > currQuestion){
                        setValues(questionsList[currQuestion+1])
                        setCurrQuestion(currQuestion + 1)
                    }
                }
            })
        }
            
        //Se decrementar
        if(option === 'decrease'){
            //Diminui o questionário atual
            setCurrQuestion(currQuestion-1)
            //Preencha o formulário com o questionário anterior
            setValues(questionsList[currQuestion-1])
        }
    }
    
  return (
    <div className='container mx-auto p-4 text-center md:w-[60%]'>
        <Typography className='text-3xl text-white mb-2'>
            Criar Questões
        </Typography>
        <Grid component={Paper} padding={2} className='flex flex-col items-center'>
            <Typography className='font-bold'>
                Questão #{String(currQuestion+1).padStart(2, '0')}
            </Typography>
            <div
             onClick={() => {
                questionImageRef.current.click()
             }}
            className='w-[150px] overflow-hidden h-[150px] rounded-md flex justify-center items-center cursor-pointer' style={{border: '#ccc dashed 2px'}}>
                {
                    questionImageThumb ?
                    <img src={questionImageThumb} alt="questionImage" className='w-[100%] h-[100%] object-cover'/>
                    :
                    <IoImage size={40} color={'#ccc'}/>
                }
            </div>

            <input
            onChange={e => {
                let tempImg = e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : ''
                setQuestionImageThumb(tempImg)
                setFieldValue('image', e.target.files[0] ? e.target.files[0] : '')
            }}
            type="file"
            className='hidden'
            ref={questionImageRef}/>
            <FormControl fullWidth>
                <TextField
                label='Pergunta'
                rows={3}
                multiline
                margin='dense'
                value={question}
                id='question'
                onChange={e  => {
                    setFieldValue('question', e.target.value)
                    if(errors.question) delete errors.question
                }}
                helperText={errors.question && errors.question}
                error={Boolean(errors.question)}
                />

                <TextField
                label='Resposta Correta'
                margin='dense'
                size='small'
                value={correct_answer}
                id='correct_answer'
                onChange={e  => {
                    setFieldValue('correct_answer', e.target.value)
                    setFieldValue('answer_1', e.target.value)
                    if(errors.correct_answer) delete errors.correct_answer;
                }}
                helperText={errors.correct_answer && errors.correct_answer}
                error={Boolean(errors.correct_answer)}
                />

                <TextField
                label='Resposta Incorreta #01'
                margin='dense'
                size='small'
                value={answer_2}
                id='answer_2'
                onChange={e  => {
                    setFieldValue('answer_2', e.target.value)
                    if(errors.answer_2) delete errors.answer_2;
                }}
                helperText={errors.answer_2 && errors.answer_2}
                error={Boolean(errors.answer_2)}
                />
                
                <TextField
                label='Resposta Incorreta #02'
                margin='dense'
                size='small'
                value={answer_3}
                id='answer_3'
                onChange={e  => {
                    setFieldValue('answer_3', e.target.value)
                    if(errors.answer_3) delete errors.answer_3;
                }}
                helperText={errors.answer_3 && errors.answer_3}
                error={Boolean(errors.answer_3)}
                />

                <TextField
                label='Resposta Incorreta #03'
                margin='dense'
                size='small'
                value={answer_4}
                id='answer_4'
                onChange={e  => {
                    setFieldValue('answer_4', e.target.value)
                    if(errors.answer_4) delete errors.answer_4;
                }}
                helperText={errors.answer_4 && errors.answer_4}
                error={Boolean(errors.answer_4)}
                />

                <TextField
                label='Resposta Incorreta #04'
                margin='dense'
                size='small'
                value={answer_5}
                id='answer_5'
                onChange={e  => {
                    setFieldValue('answer_5', e.target.value)
                    if(errors.answer_5) delete errors.answer_5;
                }}
                helperText={errors.answer_5 && errors.answer_5}
                error={Boolean(errors.answer_5)}
                />
            </FormControl>

            <div className='flex w-[100%] mt-2'>
                {
                    ((questionsList.length > 0) && (currQuestion > 0)) &&
                    <Button
                    onClick={() => handleQuestionList('decrease')}
                    >
                        
                        <HiChevronLeft size={20}/>
                        VOLTAR
                    </Button>
                }
                <Button
                onClick={() => handleQuestionList('increase')}
                className='ml-auto'>
                    Confirmar
                    <HiChevronRight
                    size={20}/>
                </Button>
            </div>
        </Grid>
        <Button
        onClick={() => {
            if(questionsList.length > 0){
                handleSubmitData()
                return
            }
            dispatch(changeAlert({open: true, class: 'error', msg: 'Você precisa de pelo menos uma questão inclusa pra poder salvar no banco de dados.'}))
        }}
        variant='contained' color={'secondary'} className='mt-3'>
            Salvar
        </Button>
    </div>
  )
}

export default MenuWrapper(CreateQuestions)
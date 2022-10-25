import { Grid, Paper, Typography, TextField, FormControl, Button, Select, MenuItem, InputLabel } from '@mui/material'
import CustomDialog from 'components/dialog/Dialog'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import { useFormik } from 'formik'
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import { FcIdea, FcOpenedFolder, FcCheckmark, FcHighPriority } from 'react-icons/fc'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { IoImage } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { changeAlert } from 'store/Actions/alert.action'
import { store, success as questionsSuccess } from 'store/Actions/questions.action'
import { change } from 'store/Actions/quizz.action'
import { change as changeRules } from 'store/Actions/rules.action'

import { questionFormSchema } from './validation/questionFormValidation'

import Lottie from 'lottie-react'
import { Waiting } from 'assets'
import { HttpAuth } from 'config/Http'
import CategorySelector from 'components/categorySelector/CategorySelector'
import { changeLoading } from 'store/Actions/loading.action'

const CreateQuestions = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { success } = useSelector(state => state.questionsReducer)
    const { rules } = useSelector(state => state.rulesReducer)
    const { newQuizz: {category: quizzCategory, ...otherNewQuizz}, creatingNewQuizz } = useSelector(state => state.quizzReducer)
    const {category} = useSelector(state => state.categoriesReducer)

    const [questionsList, setQuestionsList] = useState([])
    const [currQuestion, setCurrQuestion] = useState(0)
    const [questionImageThumb, setQuestionImageThumb] = useState('')
    const [createQuizz, setCreateQuizz] = useState(false)
    const [prepareUpload, setPrepareUpload] = useState(false)

    const [showQuestionCreateDialog, setShowQuestionCreateDialog] = useState(false)
    const [showCategoryDialog, setShowCategoryDialog] = useState(false)

    const [questionFile, setQuestionFile] = useState(null)
    const questionImageRef = useRef(null)
    const fileInput = useRef(null)

    useEffect(() => {
        if (createQuizz) {
            setCreateQuizz(location.state.createQuizz)
        }
    }, [createQuizz])

    useEffect(() => {
        if (success) {
            if (creatingNewQuizz) {
                dispatch(change({ creatingNewQuizz: false }))
                navigate('/quizz/list', { replace: true })
            } else {
                navigate('/questions', { replace: true })
            }
        }

        return () => {
            dispatch(questionsSuccess(false))
            dispatch(changeRules('clear'))
        }
    }, [success])

    useEffect(() => {
        let url = new URLSearchParams(location.search)
        let urlParams = Object.fromEntries(url.entries());
        if (Boolean(urlParams.onlyquestions) === true) {
            setShowQuestionCreateDialog(true)
        }

        return () => dispatch(changeLoading('clear'))
    }, [])

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
            answer_1: '',
            answer_2: '',
            answer_3: '',
            answer_4: '',
            answer_5: '',
            correct_answer: ''
        },
        validationSchema: questionFormSchema,
        validateOnChange: false,
    })

    const handleSubmitData = async () => {
     
        const formData = new FormData()
        formData.append('createQuizz', createQuizz)

        questionsList.forEach((questionObj, i) => {
            Object.keys(questionObj).forEach(att => {
                if (questionObj[att] instanceof File) {
                    formData.append(`question_image_${i}`, questionObj[att])
                }
            })
            formData.append(`questions[${i}]`, JSON.stringify(questionObj))
        })

        if(creatingNewQuizz){
            let imageFile = await getFileFromBlob(otherNewQuizz.image)
            let data = {...otherNewQuizz, image: otherNewQuizz.image !== '' ? imageFile :  ''}
            Object.keys(data).forEach((rule) => {
                formData.append(rule, data[rule])
            })

        }else{
            Object.entries(rules).forEach(entry => formData.append(entry[0], entry[1]))
        }

        
        dispatch(store(formData))
    }

    const getFileFromBlob = async (blob) => {
        let data = await fetch(blob)
        const blobFile = await data.blob();
        return blobFile
    }

    const handleQuestionList = option => {
        
        if (option === 'increase') {
            validateForm().then(errors => {
                //Se não tiver nenhum erro
                if (Object.keys(errors).length <= 0) {
                    //se não houver outra pergunta, aumenta mais uma
                    if (questionsList.length === currQuestion || questionsList.length === 0) {
                        setQuestionsList(old => [...old, values])
                        setCurrQuestion(currQuestion + 1)
                        setQuestionImageThumb(null)
                        resetForm()
                        return
                    }
                    
                    if (questionsList.length > currQuestion) {
                        let questionIndex = questionsList.indexOf(questionsList[currQuestion])
                        
                        if(questionIndex !== -1){
                            let newQuestionList = questionsList
                            newQuestionList[questionIndex] = values
                            let tempThumb = questionsList[currQuestion+1]?.image ? URL.createObjectURL(questionsList[currQuestion+1].image) : ''
                            setQuestionImageThumb(tempThumb)
                            setQuestionsList(newQuestionList)
                        }

                        if (questionsList.length-1 === currQuestion || questionsList.length === 0) {
                            setCurrQuestion(currQuestion + 1)
                            setQuestionImageThumb(null)
                            resetForm()
                            return
                        }

                        setCurrQuestion(currQuestion + 1)
                        setValues(questionsList[currQuestion+1])
                    }
                }
            })
        }

        //Se decrementar
        if (option === 'decrease') {
            let tempThumb = questionsList[currQuestion-1].image !== '' ? URL.createObjectURL(questionsList[currQuestion-1].image) : ''
            setQuestionImageThumb(tempThumb)
            //Diminui o questionário atual
            setCurrQuestion(currQuestion - 1)
            //Preencha o formulário com o questionário anterior
            setValues(questionsList[currQuestion - 1])
        }
    }

    const handleUploadQuestions = () => {
        const fd = new FormData()
        fd.append('question_file', questionFile)
        fd.append('category_id', rules.category_id)

        dispatch(changeLoading({open: true, text: 'Importando questões. Aguarde, por favor...'}))
        
        HttpAuth.post('question/upload', fd).then(() => {
            dispatch(changeLoading({open: false}))
            navigate('/success/upload', {
                state: {
                    questionFileUploadSuccess: true
                }
            })
        })
}

return (
    <div className='container mx-auto p-4 text-center md:w-[60%]'>
            {
                !showQuestionCreateDialog &&
                <>
                    <Typography className='text-3xl text-white mb-2'>
                        Criar Questões
                    </Typography>
                    <Grid component={Paper} padding={2} className='flex flex-col items-center'>
                        <Typography className='font-bold'>
                            Questão #{String(currQuestion + 1).padStart(2, '0')}
                        </Typography>
           
                        <div
                            onClick={() => {
                                questionImageRef.current.click()
                            }}
                            className='w-[150px] overflow-hidden h-[150px] rounded-md flex justify-center items-center cursor-pointer' style={{ border: '#ccc dashed 2px' }}>
                            {
                                questionImageThumb ?
                                    <img src={questionImageThumb} alt="questionImage" className='w-[100%] h-[100%] object-cover' />
                                    :
                                    <IoImage size={40} color={'#ccc'} />
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
                            ref={questionImageRef} />
                        <FormControl fullWidth>
                            <TextField
                                label='Pergunta'
                                rows={3}
                                multiline
                                margin='dense'
                                value={question}
                                id='question'
                                onChange={e => {
                                    setFieldValue('question', e.target.value)
                                    if (errors.question) delete errors.question
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
                                onChange={e => {
                                    setFieldValue('correct_answer', e.target.value)
                                    setFieldValue('answer_1', e.target.value)
                                    if (errors.correct_answer) delete errors.correct_answer;
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
                                onChange={e => {
                                    setFieldValue('answer_2', e.target.value)
                                    if (errors.answer_2) delete errors.answer_2;
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
                                onChange={e => {
                                    setFieldValue('answer_3', e.target.value)
                                    if (errors.answer_3) delete errors.answer_3;
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
                                onChange={e => {
                                    setFieldValue('answer_4', e.target.value)
                                    if (errors.answer_4) delete errors.answer_4;
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
                                onChange={e => {
                                    setFieldValue('answer_5', e.target.value)
                                    if (errors.answer_5) delete errors.answer_5;
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

                                    <HiChevronLeft size={20} />
                                    VOLTAR
                                </Button>
                            }
                            <Button
                                onClick={() => handleQuestionList('increase')}
                                className='ml-auto'>
                                Confirmar
                                <HiChevronRight
                                    size={20} />
                            </Button>
                        </div>
                    </Grid>
                    <Button
                        onClick={() => {
                            if (questionsList.length > 0) {
                                handleSubmitData()
                                return
                            }
                            dispatch(changeAlert({ open: true, class: 'error', msg: 'Você precisa de pelo menos uma questão inclusa pra poder salvar no banco de dados.' }))
                        }}
                        variant='contained' color={'secondary'} className='mt-3'>
                        Salvar
                    </Button>
                </>
            }


            <CustomDialog
                open={showQuestionCreateDialog}
                cancelButtonText={'Voltar para o menu Principal'}
                handleClose={() => navigate('/home')}
            >
                {!prepareUpload ?
                    <>
                        <h1 className='text-4xl text-blue-500 px-4 text-center mt-auto mb-4'>Como você irá criar suas perguntas?</h1>
                        <div
                            onClick={() => {
                                fileInput.current.click()
                            }}
                            className='h-[120px] w-[280px] md:w-[380px]  mb-4 text-white flex items-center text-2xl px-4 bg-blue-600 rounded-xl cursor-pointer hover:bg-orange-500'>
                            <FcOpenedFolder size={80} className={'mr-4'} />
                            <div className="flex flex-col">
                                <h2>Fazer Upload</h2>
                                <h5 className='text-base'>Formatos Suportados: csv, xls, xlsx.</h5>
                            </div>
                        </div>

                        <div
                            onClick={() => {
                                setShowQuestionCreateDialog(false)
                                setShowCategoryDialog(true)
                            }}
                            className='h-[120px] w-[280px] md:w-[380px] text-sky-500 flex items-center text-2xl px-4 bg-white rounded-xl cursor-pointer hover:bg-orange-500 hover:text-white'>
                            <FcIdea size={80} className={'mr-4'} />
                            Criar Questões Manualmente
                        </div>
                        <input
                            onChange={e => {
                                setPrepareUpload(true)
                                setQuestionFile(e.target.files[0])
                                setShowCategoryDialog(true)
                            }}
                            type="file"
                            className='hidden'
                            ref={fileInput} />
                    </>
                    :
                    !showCategoryDialog &&
                    <div className='flex flex-col px-4 items-center mt-auto mb-auto'>
                        <Lottie animationData={Waiting} />
                        <h1 className='text-3xl text-blue-500 text-center'>Tem certeza que este é o arquivo correto?</h1>
                        <div
                            onClick={() => handleUploadQuestions()}
                            className='mt-4 md:w-[350px] md:h-[60px] text-sky-500 flex items-center justify-center text-2xl px-4 py-2 bg-white rounded-xl cursor-pointer hover:bg-orange-500 hover:text-white'>
                            <FcCheckmark size={40} className={'mr-4'} />
                            Absoluta!
                        </div>

                        <div
                            onClick={() => dispatch(change({ creatingNewQuizz: false }))}
                            className='mt-4 md:w-[350px] md:h-[60px] mb-auto text-sky-500 flex items-center justify-center text-2xl px-4 py-2 bg-white rounded-xl cursor-pointer hover:bg-orange-500 hover:text-white'>
                            <FcHighPriority size={40} className={'mr-4'} />
                            Prefiro escolher outro
                        </div>
                    </div>}
            </CustomDialog>
            <CustomDialog
            open={showCategoryDialog}
            dialogtitle={'Selecione uma categoria'}
            dialogcontenttext={'Todas as questões serão criadas com a categoria selecionada'}
            actionButtonText={'Selecionar Categoria'}
            handleConfirm={() => {

                if(category.id === 0){
                    dispatch(changeAlert({open: true, class: 'error', msg: 'Você precisa selecionar ao menos uma categoria'}))
                }else{
                    setShowCategoryDialog(false)
                }
            }}
            >
                <CategorySelector
                category={rules.category_id}
                changeHandler={e => dispatch(changeRules({rules:{category_id: e.target.value}}))}
                />
            </CustomDialog>
        </div>
    )
}

export default MenuWrapper(CreateQuestions)
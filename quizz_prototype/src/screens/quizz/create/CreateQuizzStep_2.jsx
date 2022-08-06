import MenuWrapper from 'components/wrappers/MenuWrapper'
import React, { useRef, useState } from 'react'

import { FcOpenedFolder, FcIdea,FcCheckmark, FcHighPriority } from 'react-icons/fc'
import {IoMdReturnLeft} from 'react-icons/io'

import { useDispatch, useSelector } from 'react-redux'
import { change, uploadQuizzFile } from 'store/Actions/quizz.action'
import { change as changeCategory } from 'store/Actions/categories.action'

import Lottie from 'lottie-react'
import { Waiting } from 'assets'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'


const CreateQuizzStep_2 = () => {


    // React.useEffect(() => {
    //     return () => {
    //         dispatch(changeCategory('clear'))
    //     }
    // }, [])

    
    const { newQuizz } = useSelector(state => state.quizzReducer)
    const dispatch = useDispatch()

    const navigate = useNavigate()
    
    const [prepareUpload, setPrepareUpload] = useState(false)
    const fileInput = useRef(null)
    
    const handleUploadQuestions = e => {
        dispatch(change({ newQuizz: { ...newQuizz, createQuizz: true, question_file: URL.createObjectURL(e.target.files[0]) } }))
        setPrepareUpload(true)
    }
    
    return (
        <div className='flex flex-col items-center min-h-[75vh] md:w-[30vw] md:mx-auto'>
            
            {
                !prepareUpload ?
                <>
                <h1 className='text-4xl text-white px-4 text-center mt-auto mb-4 w-[380px]'>Como você irá criar seu novo Quizz?</h1>
                        <div
                            onClick={() => fileInput.current.click()}
                            className='h-[120px] w-[280px] md:w-[380px]  mb-4 text-white flex items-center text-2xl px-4 bg-blue-600 rounded-xl cursor-pointer hover:bg-orange-500'>
                            <FcOpenedFolder size={80} className={'mr-4'} />
                            <div className="flex flex-col">
                                <h2>Fazer Upload</h2>
                                <h5 className='text-base'>Formatos Suportados: csv, xls, xlsx.</h5>
                            </div>
                        </div>

                        <div
                            onClick={() => navigate('/questions/create', {replace: true, state: {createQuizz: true}})}
                            className='h-[120px] w-[280px] md:w-[380px] text-sky-500 flex items-center text-2xl px-4 bg-white rounded-xl cursor-pointer hover:bg-orange-500 hover:text-white'>
                            <FcIdea size={80} className={'mr-4'} />
                            Criar Questões Manualmente
                        </div>
                        <input
                            onChange={handleUploadQuestions}
                            type="file"
                            className='hidden'
                            ref={fileInput} />
                            <Button className='bg-white mb-auto mt-2' onClick={() => dispatch(change({creatingNewQuizz: false}))}><IoMdReturnLeft className='mr-2'/> Voltar </Button>
                    </>
                    :
                    <div className='flex flex-col px-4 items-center mt-auto mb-auto'>
                        <Lottie animationData={Waiting}/>
                        <h1 className='text-3xl text-white text-center'>Tem certeza que este é o arquivo correto?</h1>
                        <div
                            onClick={() => dispatch(uploadQuizzFile(newQuizz))}
                            className='mt-4 md:w-[350px] md:h-[60px] text-sky-500 flex items-center justify-center text-2xl px-4 py-2 bg-white rounded-xl cursor-pointer hover:bg-orange-500 hover:text-white'>
                            <FcCheckmark size={40} className={'mr-4'} />
                            Absoluta!
                        </div>

                        <div
                        onClick={() => dispatch(change({creatingNewQuizz: false}))}
                            className='mt-4 md:w-[350px] md:h-[60px] mb-auto text-sky-500 flex items-center justify-center text-2xl px-4 py-2 bg-white rounded-xl cursor-pointer hover:bg-orange-500 hover:text-white'>
                            <FcHighPriority size={40} className={'mr-4'} />
                            Prefiro escolher outro
                        </div>
                    </div>
            }
        </div>
    )
}

export default MenuWrapper(CreateQuizzStep_2)
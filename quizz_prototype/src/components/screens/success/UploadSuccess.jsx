import React, { useEffect } from 'react'
import MenuWrapper from 'components/wrappers/MenuWrapper'

import Lottie from 'lottie-react'

import { useDispatch, useSelector } from 'react-redux'
import { UploadFile } from 'assets'
import { changeAlert } from 'store/Actions/alert.action'
import { IoMdCopy, IoMdHome } from 'react-icons/io'

import { change } from 'store/Actions/quizz.action'
import {change as changeGame} from 'store/Actions/game.action'

import { useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import { BiPencil } from 'react-icons/bi'


const UploadSuccess = () => {

    const dispatch = useDispatch()
    const {token} = useSelector(state => state.quizzReducer)

    const navigate = useNavigate()
    
    useEffect(() => {
        return () => {
            dispatch(changeGame('clear'))
            dispatch(change('clear'))
        }
    })

    return (
        <div className='flex flex-col items-center min-h-[75vh] md:w-[30vw] md:mx-auto'>
            <Lottie animationData={UploadFile} loop={false} initialSegment={[0, 114]} className='mt-auto' />
            {
                <>
                    <div className='w-[80vw] md:w-[50vw] flex flex-col items-center justify-center mb-auto'>
                        <h1 className='text-3xl text-white text-center bg-orange-500 p-2 rounded-xl'>
                            {token ? 'Seu Quizz foi criado com sucesso!' : 'Suas questões foram criadas com sucesso'}
                        </h1>
                        <h2 className='text-2xl text-white mt-2 text-center'>
                            {token ? 'Compartilhe este quizz com seus amigos através desse Token' : 'Você pode selecioná-las e criar um novo quizz'}
                        </h2>
                        {
                            token &&
                            <div
                                onClick={() => {
                                    navigator.clipboard.writeText(token)
                                    dispatch(changeAlert({ open: true, msg: 'Token copiado para a área de transferência', class: 'success' }))
                                }}
                                className='text-center mt-4 bg-white text-3xl text-sky-600 flex items-center mx-auto p-5 px-10 rounded-xl cursor-pointer'>
                                {token}
                                <IoMdCopy className='ml-2' />
                            </div>
                        }

                        <div className='mt-2 flex flex-col'>
                            <Button
                                className='my-4'
                                variant='contained'
                                onClick={() => {
                                    dispatch(changeGame("clear"))
                                    navigate('/home', {replace: true})
                                }}

                            >
                                <IoMdHome className='mr-2' />
                                Voltar à tela principal
                            </Button>
                            <Button
                                variant='contained'
                                color='secondary'
                                onClick={() => {
                                    dispatch(changeGame("clear"))
                                    if(token){
                                        navigate('/quizz/list', {replace: true})
                                    }else{
                                        navigate('/questions/list', {replace: true})
                                    }
                                }}

                            >
                                <BiPencil className='mr-2' />
                                {token ? 'Ver Lista de Quizzes' : 'Ver Lista de Questões'}
                            </Button>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default MenuWrapper(UploadSuccess)
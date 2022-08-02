import React from 'react'

import { HiX } from 'react-icons/hi'
import { styled } from '@mui/material/styles';
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { useSelector } from 'react-redux';
import userReducer from 'store/Reducers/user.reducer';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


const RankingModal = (props) => {

    const { open, setOpen, dialogtitle, ranking } = props

    const handleClose = () => {
        setOpen(false);
    };

    const {user} = useSelector(state => state.userReducer)


    return (
        <div className='max-w-[80vw] '>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                className='max-h-[80vh] md:h-auto'
            >
                <DialogTitle className='text-sm flex' onClose={handleClose}>
                    {dialogtitle}
                    <HiX className='ml-auto my-auto text-lg' onClick={handleClose}/>
                </DialogTitle>
                <DialogContent dividers>
                    {
                        ranking.map((el, i) => (
                            <React.Fragment key={(Math.random() + 1).toString(36).substring(7)+i}>
                                <div className={`flex w-[70vw] justify-between ${el.pivot.user_id === user.id && 'bg-green-200 p-2'}`}>
                                    <div className="flex flex-col">
                                        <h6>{`${el.pivot.user_id === user.id ? 'Sua' : ''} Posição`}</h6>
                                        <h6>{i+1}º</h6>
                                    </div>
                                    <div className="flex flex-col items-center text-center w-[30%]">
                                        <h6>Nome</h6>
                                        <h6>{el.name}</h6>
                                    </div>
                                    <div className="flex flex-col">
                                        <h6>Pontuação</h6>
                                        <h6>{el.pivot.score} Pontos</h6>
                                    </div>
                                </div>
                                <div className='text-center bg-slate-200'>Quizz Feito em: {new Date(el.pivot.updated_at).toLocaleString('pt-BR')}</div>
                                <hr className='my-4' />

                            </React.Fragment>
                        ))
                    }

                </DialogContent>
            </BootstrapDialog>
        </div>
    )
}

export default RankingModal
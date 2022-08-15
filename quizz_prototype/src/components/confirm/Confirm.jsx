import { Modal, Paper } from '@mui/material'
import React from 'react'

import {useSelector, useDispatch} from 'react-redux'
import { changeConfirm } from '../../store/Actions/confirm.action'



export const Confirm = () => {
    const dispatch = useDispatch()
    const {open,title, msg, confirmAction} = useSelector(state => state.confirmReducer)

  return (
    <Modal open={open}>
        <Paper className='absolute outline-none w-[80vw] md:w-[450px] p-4 shadow bottom-[50%] left-[50%] translate-x-[-50%] translate-y-[50%]'>
            <h3 className='text-2xl text-sky-500'>{title}</h3>
            <p className='mt-2'>{msg}</p>

            <div className="flex justify-center mt-4">
                <button
                onClick={confirmAction}
                className='bg-lime-600 px-4 py-2 text-white mr-2 rounded-md flex-1'>
                    Confirmar
                </button>
                <button
                onClick={() => dispatch(changeConfirm({open: false}))}
                className='bg-red-600 px-4 py-2 text-white mr-2 rounded-md flex-1'>
                    Cancelar
                </button>
            </div>
        </Paper>
    </Modal>
  )
}

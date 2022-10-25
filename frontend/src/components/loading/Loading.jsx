import React from 'react'
import {Modal, Box, CircularProgress} from '@mui/material'
import { useSelector } from 'react-redux/es/exports'

export const Loading = () => {

    const state = useSelector(state => state.loadingReducer)

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    
  return (
    <Modal
    open={state.open}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    >
        <Box style={style} className='bg-white px-6 py-4 rounded-md flex items-center z-[9999]'>
            <CircularProgress size={30} color='secondary'/>
            <span className='ml-4'>{state.text}</span>
        </Box>
    </Modal>
  )
}

import React, { useState, useEffect } from 'react'
import Modal from '@mui/material/Modal';
import { Button, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ContactForm from 'components/contactForm/ContactForm';
import { HiX } from 'react-icons/hi';
import { change } from 'store/Actions/modal.action';

const defaultComponent = () => (
    <>
        Set your component here
    </>
)

const CustomModal = () => {
    const dispatch = useDispatch()
    const {open, modalComponent, modalTitle} = useSelector(state => state.modalReducer)

    

  return (
    <Modal open={open}>
        <Paper className='absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] p-4 outline-none w-[80%] md:w-[50%]'>
            <div className='flex justify-between items-center'>
                <h1>{modalTitle}</h1>
                <Button onClick={() => dispatch(change({open: false}))}>
                    <HiX size={20}/>
                </Button>
            </div>
            <hr className='my-4'/>
            {
                modalComponent === 'default' &&
                <p>
                    Set your component
                </p>
            }
            {
                modalComponent === 'emailForm' &&
                <ContactForm/>
            }
        </Paper>
    </Modal>
  )
}

export default CustomModal
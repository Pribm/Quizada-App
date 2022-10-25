import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, dialogtitle } from '@mui/material'
import { MdClose } from 'react-icons/md'

const CustomDialog = (props) => {

    const {dialogtitle, showCloseButton, dialogcontenttext , children, handleClose, actionButtonText, cancelButtonText = 'Cancelar', handleConfirm, open, ...other } = props
    

  return (
    <Dialog open={open} onClose={handleClose}>
        <div className='flex  items-center'>
            <DialogTitle>
                {dialogtitle}
            </DialogTitle>

           {
            showCloseButton &&
            <MdClose className='ml-auto mr-4 cursor-pointer p-4 ' size={60} onClick={handleClose}/>
           }
        </div>
        <DialogContent>
            <DialogContentText>
                {dialogcontenttext}
            </DialogContentText>
            <div {...other}>
                {children}
            </div>
        </DialogContent>
        <DialogActions>
            {
                (handleClose && !showCloseButton) &&
                <Button onClick={handleClose}>{cancelButtonText}</Button>
            }
            {
                handleConfirm &&
                <Button onClick={handleConfirm}>{actionButtonText}</Button>
            }
        </DialogActions>
    </Dialog>
  )
}

export default CustomDialog
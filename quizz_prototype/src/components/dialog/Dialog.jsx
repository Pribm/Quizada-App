import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

const CustomDialog = (props) => {

    const {dialogTitle, dialogContentText, children, handleClose, actionButtonText, cancelButtonText = 'Cancelar', handleConfirm, open } = props
    

  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
            {dialogTitle}
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                {dialogContentText}
            </DialogContentText>
            <div>
                {children}
            </div>
        </DialogContent>
        <DialogActions>
            {
                handleClose &&
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
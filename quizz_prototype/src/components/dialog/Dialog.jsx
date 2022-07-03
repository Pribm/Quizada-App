import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

const CustomDialog = (props) => {

    const {dialogTitle, dialogContentText, dialogBody, handleClose, actionButtonText, handleConfirm, open } = props
    

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
                {dialogBody}
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleConfirm}>{actionButtonText}</Button>
        </DialogActions>
    </Dialog>
  )
}

export default CustomDialog
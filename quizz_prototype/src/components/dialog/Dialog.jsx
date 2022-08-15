import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, dialogtitle } from '@mui/material'

const CustomDialog = (props) => {

    const {dialogtitle, dialogcontenttext , children, handleClose, actionButtonText, cancelButtonText = 'Cancelar', handleConfirm, open, ...other } = props
    

  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
            {dialogtitle}
        </DialogTitle>
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
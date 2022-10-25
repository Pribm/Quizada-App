import { AppBar, Button, Dialog, IconButton, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FaSave } from 'react-icons/fa'

const FullScreenDialog   = (props) => {

    const { open, setOpen, title, handleSave } = props

    const handleClose = () => {
        setOpen(false);
    };

  return (
    <Dialog
    fullScreen
    open={open}
    onClose={handleClose}
    >
        <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
                  <IconButton
                      edge="start"
                      color="inherit"
                        onClick={handleClose}
                      aria-label="close"
                  >
                      <AiOutlineClose />

                  </IconButton>
                  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                      {title}
                  </Typography>
                  {
                    handleSave &&
                    <Button autoFocus color="inherit" onClick={handleSave}>
                      <FaSave size={25}/>
                    </Button>
                  }
            </Toolbar>
        </AppBar>
            {
                props.children
            }
    </Dialog>
  )
}

export default FullScreenDialog
import React from 'react'

import { logo } from 'assets'


import { Button, Grid, Paper, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material'


import { getQuizzThumbnail } from 'utils/getThumbnails'
import { BiTrophy } from 'react-icons/bi'

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { MdClose } from 'react-icons/md'


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <MdClose />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const RankingModal = (props) => {

    const { open, setOpen, title, ranking } = props

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div className='max-w-[80vw] '>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                className='max-h-[80vh] md:h-auto'
            >
                <BootstrapDialogTitle id="customized-dialog-title" className='text-sm' onClose={handleClose}>
                    {title}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    {
                        ranking.map((el, i) => (
                            <React.Fragment>

                                <div className='flex xs:min-w-[70vw] justify-between'>
                                    <div className="flex flex-col">
                                        <h6>Posição</h6>
                                        <h6>{i+1}º</h6>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <h6>Nome</h6>
                                        <h6>{el.name}</h6>
                                    </div>
                                    <div className="flex flex-col">
                                        <h6>Pontuação</h6>
                                        <h6>{el.pivot.score} Pontos</h6>
                                    </div>
                                </div>
                                <hr className='my-4' />

                            </React.Fragment>
                        ))
                    }

                </DialogContent>
            </BootstrapDialog>
        </div>
    )
}


const FinishedQuizzCard = ({ props }) => {


    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Grid container component={Paper} className='my-4 text-left bg-slate-50'>
                <Grid item xs={4} >
                    <img src={props.image ? getQuizzThumbnail(props.image) : logo} alt="logo" className='w-[100%] h-[120px] object-cover' />
                </Grid>
                <Grid item xs={8} className='p-2'>
                    <h1 className='text-lg'>{props.title}</h1>
                    <p className='text-sm'> {props.description}</p>
                </Grid>
                <Grid container className='bg-white'>
                    <Grid item xs={4} className='p-2 ml-auto'>
                        <Button
                            onClick={() => setOpen(true)}
                            size='small'
                            variant='contained'>
                            <BiTrophy size={20} />
                            <p>Ranking</p>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <RankingModal
                open={open}
                setOpen={setOpen}
                title={props.title}
                ranking={props.invitation}
            />
        </>
    )
}

export default FinishedQuizzCard
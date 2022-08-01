import React from 'react'

import { logo } from 'assets'
import { Button, Grid, Paper} from '@mui/material'
import { getQuizzThumbnail } from 'utils/getThumbnails'
import { BiTrophy } from 'react-icons/bi'
import RankingModal from 'components/ranking/RankingModal'




const FinishedQuizzCard = ({ props }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Grid container component={Paper} className={`my-4 text-left bg-slate-50 ${props.className}`}>
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
                dialogtitle={props.title}
                ranking={props.invitation}
            />
        </>
    )
}

export default FinishedQuizzCard
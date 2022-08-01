import React from 'react'

import { HiTrash } from 'react-icons/hi'
import { logo } from 'assets'
import { IoMdCopy } from 'react-icons/io'

import {Card, CardActions, CardContent, CardMedia, Typography, Button} from '@mui/material'
import { changeConfirm } from 'store/Actions/confirm.action'

import { destroy } from 'store/Actions/quizz.action'

import { getQuizzThumbnail } from 'utils/getThumbnails'
import { MdGamepad } from 'react-icons/md'
import { changeAlert } from 'store/Actions/alert.action'
import DownloadQuizzSpreadsheet from 'components/buttons/DownloadQuizzSpreadsheet'
import { show } from 'store/Actions/game.action'

const HorizontalQuizzCardLarge = ({ props }) => (
    <Card className='my-4 mx-2 flex flex-wrap md:flex-nowrap min-h-[150px] ' key={props.key}>
        <CardMedia
          component={'img'}
          image={props.image ? getQuizzThumbnail(props.image) : logo}
          alt="logo"
          className='w-[50px] md:w-[120px] object-cover mx-auto'
        />

        <CardContent>
          <Typography  variant='h5' component={'div'}>
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>
          
          <div className="flex items-center justify-between">
            <Typography  variant='h6' component={'div'} className='text-orange-600 mt-2'>
              {props.category?.name ? props.category.name : 'Quizz sem categoria'}
            </Typography>
          </div>
        </CardContent>
  
      <CardActions className='my-auto'>
          <Button
          className='flex items-center mb-auto'
          variant='contained'
          size="small"
          color="primary"
          onClick={() => props.dispatch(changeConfirm({
            open: true,
            title: 'Você está preparado para iniciar o quizz?',
            msg: 'Atenção, os quizzes criados por você não concedem pontuação para o ranking, para ganhar pontos você precisa fazer um quizz gerado por outra pessoa.',
            confirmAction: () => props.dispatch(show(props.token)).then(() => {
              props.dispatch(changeConfirm({open: false}))
            })
          }))}
          >
            <MdGamepad className='mr-2' size={20}/>
            Fazer Quizz
          </Button>
      </CardActions>
    </Card>
  )

export default HorizontalQuizzCardLarge
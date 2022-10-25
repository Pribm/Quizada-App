import React from 'react'

import { logo } from 'assets'

import {Card, CardActions, CardContent, CardMedia, Typography, Button, Checkbox} from '@mui/material'
import { changeConfirm } from 'store/Actions/confirm.action'

import { getQuizzThumbnail } from 'utils/getThumbnails'
import { MdGamepad } from 'react-icons/md'
import { show } from 'store/Actions/game.action'

const HorizontalQuizzCard = ({ props }) => {

  const {id, image, key, title, category, token, handleChange} = props

  return (
    <div className='bg-white shadow-md rounded-md h-[120px] flex p-2 mb-4' key={key}>
      <img className='h-[100px] w-[100px] object-cover rounded-lg overflow-hidden' src={image ? getQuizzThumbnail(image) : logo} alt={title} />
      <div className='px-2 text-start flex-1'>

        <h1 className='font-bold text-blue-500'>{title}</h1>
        <h2 className='text-orange-500'>{category.name}</h2>
      </div>
      <div className='flex justify-center items-center'>
        <Checkbox
        value={id}
        inputProps={{ 'aria-label': 'controlled' }}
        onChange={e => handleChange(e)}
        />
      </div>
    </div>
  )
}

export default HorizontalQuizzCard
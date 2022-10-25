import { Button, TextField } from '@mui/material'
import { HttpAuth } from 'config/Http'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { MdSend } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { changeAlert } from 'store/Actions/alert.action'
import { changeLoading } from 'store/Actions/loading.action'
import { change } from 'store/Actions/modal.action'
import { contactFormSchema } from './validation/contactFormValidation'

const ContactForm = () => {

  const dispatch = useDispatch()
  const {user: {email}} = useSelector(state => state.userReducer)

  const {
    values: {
      name, subject, message
    },
    values,
    setFieldValue,
    errors,
    validateForm
  } = useFormik({
    initialValues: {
      name: '',
      subject: '',
      message: ''
    },
    validationSchema: contactFormSchema,
    validateOnChange: false,
  })

  return (
    <div>
      <TextField
        label={'Seu Nome'}
        fullWidth
        size={'small'}
        className='mb-4'
        value={name}
        id='name'
        onChange={e => {
            setFieldValue('name', e.target.value)
            if (errors.name) delete errors.name
        }}
        helperText={errors.name && errors.name}
        error={Boolean(errors.name)}
      />

      <TextField
        label={'Assunto'}
        fullWidth
        size={'small'}
        value={subject}
        id='subject'
        onChange={e => {
            setFieldValue('subject', e.target.value)
            if (errors.subject) delete errors.subject
        }}
        helperText={errors.subject && errors.subject}
        error={Boolean(errors.subject)}
      />

      <TextField
        label={'Mensagem'}
        multiline
        rows={8}
        fullWidth
        className='mt-4'
        size={'small'}
        value={message}
        id='message'
        onChange={e => {
            setFieldValue('message', e.target.value)
            if (errors.message) delete errors.message
        }}
        helperText={errors.message && errors.message}
        error={Boolean(errors.message)}
      />

      <Button
        fullWidth
        variant='contained'
        className='mt-4'
        onClick={() => validateForm().then(errors => {
          dispatch(changeLoading({open: true, text: 'Enviando...'}))
          if(Object.keys(errors).length === 0){
            HttpAuth.post('email/contact', {...values, email}).then(res => {
              dispatch(changeLoading({open: false}))
              if(res.status === 200){
                dispatch(change({open: false}))
                dispatch(changeAlert({open: true, msg: res.data.success, class: 'success'}))
              }else{
                dispatch(changeAlert({open: true, msg: 'Erro ao enviar o email, tente novamente', class: 'error'}))
              }
            })
          }
        })}
      >
        Enviar
        <MdSend size={20} className='ml-4' />
      </Button>
    </div>
  )
}

export default ContactForm
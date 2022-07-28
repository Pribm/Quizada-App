import { Avatar, Button, Grid, Paper, TextField, Typography, Badge, CircularProgress } from '@mui/material'
import { Container } from '@mui/system'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import { useFormik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { HiEye } from 'react-icons/hi'
import { MdEdit } from 'react-icons/md'

import { useSelector, useDispatch } from 'react-redux'

import { change, update, errors as errorsAction } from 'store/Actions/user.action'
import { updateFormSchema } from './validation/update_form_validation'

const Update = () => {

  const avatarRef = useRef(null)

  const [tempThumbnail, setTempThumbnail] = useState(null)
  const [isLoading, setLoading] = useState(true)

  const [showField, setShowField] = useState('')

  const { user, errors: userBackendErrors } = useSelector(state => state.userReducer)
  const dispatch = useDispatch()

  const { values, setFieldValue, handleSubmit, errors, setValues } = useFormik({
    initialValues: { ...user},
    validationSchema: updateFormSchema,
    onSubmit: v => submitData(v),
  })

  useEffect(() => {
    setValues({ ...user})
    if (Object.keys(user).length > 0) {
      setLoading(false)
    }
  }, [user])

  const submitData = v => {
    let formData = new FormData()

    Object.entries(v).forEach((value) => {
      if (value[0] !== 'avatar' && value[1] !== '') {
        formData.append(value[0], value[1])
      }
    })

    if (tempThumbnail) {
      formData.append('avatar', avatarRef?.current?.files[0])
    }

    dispatch(update(formData))
  }

  return (
    <Container maxWidth={'sm'}>
      <form>
        <Grid container className='mt-4'>
          <Grid item xs={12} className='flex justify-center items-center'>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <MdEdit className='w-[30px] h-[30px] text-white rounded-full bg-orange-500 p-1' />
              }
            >
              <Avatar
                className='cursor-pointer'
                alt={`${user.name} avatar`} src={!tempThumbnail ? user.avatar : tempThumbnail}
                sx={{ width: 128, height: 128, fontSize: 80 }}
                onClick={() => avatarRef.current.click()}
              />
              <input
                type="file"
                className='hidden'
                ref={avatarRef}
                onChange={e => {
                  let errorState = Object.entries(userBackendErrors).filter(([k,v]) => v !== userBackendErrors.avatar)
                  errorState = Object.fromEntries(errorState)

                  userBackendErrors.avatar && dispatch(errorsAction(errorState))
                  setTempThumbnail(URL.createObjectURL(e.target.files[0]))
                }}
                />
            </Badge>
          </Grid>
                {userBackendErrors.avatar &&
                <p className='mx-auto text-center bg-red-500 p-2 text-white mt-2'>
                  {userBackendErrors.avatar[0]}
                </p>}
          <Grid container padding={4} component={(Paper)} className='mt-8'>
            {
              isLoading ?
                <div className="flex flex-1 justify-center">
                  <CircularProgress />
                </div>
                :
                <>
                  <Grid item xs={12} className='mb-4'>
                    <TextField
                      value={values.name || ''}
                      onChange={e => {
                        setFieldValue('name', e.target.value)
                        dispatch(change({ name: e.target.value }))
                      }
                      }
                      error={errors.name && true}
                      helperText={errors.name && errors.name}
                      label='Nome'
                      fullWidth />
                  </Grid>

                  <Grid item xs={12} className='mb-4'>
                    <TextField
                      value={values?.nickname || ''}
                      onChange={e => {
                        setFieldValue('nickname', e.target.value)
                        dispatch(change({ nickname: e.target.value }))

                        let errorState = Object.entries(userBackendErrors).filter(([k,v]) => v !== userBackendErrors.nickname)
                        errorState = Object.fromEntries(errorState)

                        userBackendErrors.nickname && dispatch(errorsAction(errorState))
                      }
                      }
                      error={(errors.nickname && true) || (userBackendErrors.nickname && true)}
                      helperText={(errors.nickname && errors.nickname) || (userBackendErrors.nickname && userBackendErrors.nickname)}
                      label='Apelido'
                      fullWidth />
                  </Grid>

                  {/* <Grid item xs={12}>
                    <TextField
                      value={values?.email || ''}
                      onChange={e => {
                        setFieldValue('email', e.target.value)
                        dispatch(change({ email: e.target.value }))

                        let errorState = Object.entries(userBackendErrors).filter(([k,v]) => v !== userBackendErrors.email)
                        errorState = Object.fromEntries(errorState)

                        userBackendErrors.email && dispatch(errorsAction(errorState))
                      }
                      }
                      error={(errors.email && true) || (userBackendErrors.email && true)}
                      helperText={(errors.email && errors.email) || (userBackendErrors.email && userBackendErrors.email)}
                      label='E-mail'
                      fullWidth
                      type={'email'}
                    />
                  </Grid> */}

                  <Typography className='text-center font-bold mt-4 mb-4'>
                    {user.password_is_null ? 'Criar nova senha' : 'Alteração de senha'}
                  </Typography>

                  <Grid item xs={12} className='mb-4'>
                    <TextField
                      className='group'
                      InputProps={{
                        endAdornment: <HiEye className='text-slate-400 group-focus-within:text-blue-500' onClick={() => setShowField(field => field === '' ? 'password' : '')}/>
                      }}
                      autoComplete='on'
                      value={values.password || ''}
                      error={(errors.password && true) || (userBackendErrors.password && true)}
                      helperText={(userBackendErrors.password && userBackendErrors.password)}
                      onChange={e => {
                        setFieldValue('password', e.target.value)
                        dispatch(change({ password: e.target.value }))

                        let errorState = Object.entries(userBackendErrors).filter(([k,v]) => v !== userBackendErrors.password)
                        errorState = Object.fromEntries(errorState)

                        userBackendErrors.password && dispatch(errorsAction(errorState))
                      }
                      }
                      label={user.password_is_null ? 'Insira a senha desejada' : 'Insira a sua senha atual'}
                      fullWidth
                      type={showField === 'password' ? 'text' : 'password'} />
                  </Grid>
                  <Grid item xs={12} className='mb-4'>
                    <TextField
                      className='group'
                      InputProps={{
                        endAdornment: <HiEye className='text-slate-400 group-focus-within:text-blue-500' onClick={() => setShowField(field => field === '' ? 'password_confirm' : '')}/>
                      }}
                      autoComplete='on'
                      value={values.password_confirm || ''}
                      error={(errors.password_confirm && true) || (userBackendErrors.password_confirm && true)}
                      helperText={(userBackendErrors.password_confirm && userBackendErrors.password_confirm)}
                      onChange={e => {
                        setFieldValue('password_confirm', e.target.value)
                        dispatch(change({ password_confirm: e.target.value }))

                        let errorState = Object.entries(userBackendErrors).filter(([k,v]) => v !== userBackendErrors.password_confirm)
                        errorState = Object.fromEntries(errorState)

                        userBackendErrors.password_confirm && dispatch(errorsAction(errorState))
                      }
                      }
                      label={user.password_is_null ? 'Confirme a sua senha' : 'Insira a sua nova senha'}
                      fullWidth
                      type={showField === 'password_confirm' ? 'text' : 'password'}
                      />
                  </Grid>
                  <Button
                    onClick={handleSubmit}
                    variant='contained'
                    className='mx-auto'>
                    Atualizar Perfil
                  </Button>
                </>
            }
          </Grid>

        </Grid>
      </form>
    </Container>
  )
}

export default MenuWrapper(Update)
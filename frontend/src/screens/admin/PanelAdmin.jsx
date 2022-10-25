import { ListWrapper } from 'components/wrappers/ListWrapper'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUsersForAdm } from 'store/Actions/user.action';
import FriendCard from 'components/friendsCards/FriendCard';
import { Button, FormGroup, TextField, Typography } from '@mui/material';
import { BsGear } from 'react-icons/bs';
import CustomDialog from 'components/dialog/Dialog';
import { change, update, errors as AppErrorsAction } from 'store/Actions/app.action';

const PanelAdmin = () => {

  const [isLoading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showConfig, setShowConfig] = useState(false)

  const {users_for_adm, users_for_adm: {current_page}}  = useSelector(state => state.userReducer)
  const {appData, errors}  = useSelector(state => state.appReducer)
  const dispatch = useDispatch()

  useEffect(() => {
    
    dispatch(getUsersForAdm()).then(() => setLoading(false))
}, [])

const searchHandler = () => {
  setLoading(true)
  dispatch(getUsersForAdm({  search: search })).then(() => setLoading(false))
}

const handleLoadMore = () => {
  return dispatch(getUsersForAdm({ page: current_page + 1}, true))
}

  return (
     <>
    <div className='h-[calc(100vh-300px)] mx-4 md:mx-auto md:w-[500px]'>
      <div className="pb-4">
        <Button variant='contained' onClick={() => setShowConfig(true)}>
          <BsGear size={20}/>
          <Typography className='ml-2 capitalize'>Configurações</Typography>
        </Button>
      </div>
      <ListWrapper
        Component={FriendCard}
        //className={'min-h-[calc(100vh-120px-120px)] max-h-[calc(100vh-120px-120px)]'}
        componentData={users_for_adm}
        componentProps={{ dispatch}}
        handleLoadMore={handleLoadMore}
        search={search}
        setSearch={setSearch}
        searchHandler={searchHandler}
        isLoading={isLoading}
        setLoading={setLoading}
        searchBoxPlaceholder={'Procurar Usuário'}
        listTitle={'Usuários da plataforma'}
        notFoundList={'Nenhum Usuário foi encontrado'}
      />
    </div>
    <CustomDialog
      open={showConfig}
      dialogtitle={'Editar conteúdo da plataforma'}
      dialogcontenttext={'Aqui você pode alterar algumas informações do App'}
      handleClose={() => setShowConfig(false)}
      showCloseButton={true}
    >
      <FormGroup className='mt-4'>

        <TextField
        margin='dense'
        label='Email de Suporte'
        size='small'
        value={appData.email}
        onChange={e => {
            dispatch(change({email: e.target.value}))

            if(typeof errors.email !== 'undefined'){
              let newErr = delete errors.email
              dispatch(AppErrorsAction(newErr))
            }
          }
        }
        error={typeof errors.email !== 'undefined'}
        helperText={errors.email && errors.email[0]}
        />
        <hr className='my-4'/>

        <TextField
        margin='dense'
        label='Título do botão de pagamento'
        size='small'
        value={appData.payment_button}
        onChange={e => {
            dispatch(change({payment_button: e.target.value}))

            if(typeof errors.payment_button !== 'undefined'){
              let newErr = delete errors.payment_button
              dispatch(AppErrorsAction(newErr))
            }
          }
        }
        error={typeof errors.payment_button !== 'undefined'}
        helperText={errors.payment_button && errors.payment_button[0]}
        />

        <TextField
        margin='dense'
        label='Título da tela de pagamento'
        size='small'
        value={appData.payment_title}
        onChange={e => {
            dispatch(change({payment_title: e.target.value}))

            if(typeof errors.payment_title !== 'undefined'){
              let newErr = delete errors.payment_title
              dispatch(AppErrorsAction(newErr))
            }
          }
        }
        error={typeof errors.payment_title !== 'undefined'}
        helperText={errors.payment_title && errors.payment_title[0]}
        />

        <TextField
        margin='dense'
        label='Texto da tela de pagamento'
        size='small'
        multiline
        rows={3}
        value={appData.payment_text}
          onChange={e => {
            dispatch(change({payment_text: e.target.value}))

            if(typeof errors.payment_text !== 'undefined'){
              let newErr = delete errors.payment_text
              dispatch(AppErrorsAction(newErr))
            }
          }
        }
        error={typeof errors.payment_text !== 'undefined'}
        helperText={errors.payment_text && errors.payment_text[0]}
        />

        
        <Button
        onClick={() => dispatch(update(appData)).then(res => {
          if(res === true){
            setShowConfig(false)
          }
        })}
        variant='contained'
        className='mt-4'
        >
          Salvar
        </Button>
      </FormGroup>
    </CustomDialog>
     </>
  )
}

export default MenuWrapper(PanelAdmin)
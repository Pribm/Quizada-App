import { Button, Paper } from '@mui/material'
import CustomDialog from 'components/dialog/Dialog'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import React, { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { Link, Navigate } from 'react-router-dom'
import FriendQuizz from './FriendQuizz'
import InviteFriend from './InviteFriend'

const Multiplayer = () => {

    const [showMultiplayerDialog, setShowMultiplayerDialog] = useState(true)
    const [inviteFriend, setInviteFriend] = useState(false)
    const [friendQuizz, setFriendQuizz] = useState(false)
    

    const handleShowInviteFriendScreen = () => {
        setShowMultiplayerDialog(false)
        setInviteFriend(true)
    }

    const handleShowSetFriendQuizzScreen = () => {
        setShowMultiplayerDialog(false)
        setFriendQuizz(true)
    }

  return (
    <>
    <CustomDialog
    dialogtitle='Como você deseja iniciar seu quizz multiplayer?'
    dialogcontenttext="Você prefere convidar uma lista de amigos para fazer um quizz, ou realizar um quizz para o qual você foi convidado?"
    open={showMultiplayerDialog}
    >
              <div className='flex bg-slate-50 p-4'>
                  <Button
                      onClick={handleShowInviteFriendScreen}
                      variant='outlined'
                      className='p-4 flex shadow-md bg-white flex-col items-center text-blue-500 flex-1 mx-2'>
                      <FaUser size={30} />
                      <h3>
                          Convidar um amigo
                      </h3>
                  </Button>

                  <Button
                      onClick={handleShowSetFriendQuizzScreen}
                      variant='outlined'
                      className='p-4 flex shadow-md bg-white flex-col items-center text-blue-500 flex-1 mx-2'>
                      <IoDocumentTextOutline size={30} />
                      <h3>
                          Fazer um quizz de um Amigo
                      </h3>
                  </Button>
              </div>
              <Button>
                <Link to='/home' className='mt-2' >Voltar</Link>
              </Button>
    </CustomDialog>
    {
        friendQuizz &&
        <FriendQuizz/>
    }
    {
        inviteFriend &&
        <InviteFriend/>
    }
    </>
  )
}

export default MenuWrapper(Multiplayer)
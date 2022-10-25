import { Button } from '@mui/material'
import CustomDialog from 'components/dialog/Dialog'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { FaUser } from 'react-icons/fa'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { Link, useLocation } from 'react-router-dom'
import FriendQuizz from './FriendQuizz'
import InviteFriend from './InviteFriend'

const Multiplayer = () => {

    const location = useLocation()

    const [showMultiplayerDialog, setShowMultiplayerDialog] = useState(true)
    const [inviteFriend, setInviteFriend] = useState(false)
    const [friendQuizz, setFriendQuizz] = useState(false)

    useEffect(() => {
        let url = new URLSearchParams(location.search)
        let urlParams = Object.fromEntries(url.entries());

        if(urlParams?.show_pending){
            setShowMultiplayerDialog(false)
            setFriendQuizz(true)
          }
    }, [])
    

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
    dialogtitle='Como você deseja iniciar seu quiz multiplayer?'
    dialogcontenttext="Você prefere convidar uma lista de amigos para fazer um quizz, ou realizar um quiz para o qual você foi convidado?"
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
                          Fazer um quiz de um Amigo
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
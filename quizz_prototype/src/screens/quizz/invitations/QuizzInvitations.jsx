import * as React from 'react';
import MenuWrapper from 'components/wrappers/MenuWrapper';
import { Button, ButtonGroup, Grid } from '@mui/material';

import { useState } from 'react';
import SentQuizzInvitations from './SentQuizzInvitations';
import ReceivedQuizzInvitations from './ReceivedQuizzInvitations';

import { useLocation } from 'react-router-dom';



const QuizzInvitations = () => {

  let location = useLocation();

  const [state, setState] = useState({
    showPendingQuizzInvitationsTo: true,
    showReceivedQuizzInvitations: false,
  })

  React.useEffect(() => {
    let url = new URLSearchParams(location.search)
    let urlParams = Object.fromEntries(url.entries());

    if(urlParams?.requests){
      setState({
        showPendingQuizzInvitationsTo: false,
        showReceivedQuizzInvitations: true,
      })
    }
  }, [])


  return (
    <div className="container mx-auto  p-4 md:w-[600px]">
      <h1 className='text-white'>Convites de Quizz</h1>
      <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
        <Button
          onClick={() => setState({
            showPendingQuizzInvitationsTo: true,
            showReceivedQuizzInvitations: false,
          })}
        >Convites Enviados</Button>
        <Button
          onClick={() => setState({
            showPendingQuizzInvitationsTo: false,
            showReceivedQuizzInvitations: true,
          })}
        >Convites Recebidos</Button>
      </ButtonGroup>
      {
        state.showPendingQuizzInvitationsTo &&
        <SentQuizzInvitations />
      }
      {
        state.showReceivedQuizzInvitations &&
        <ReceivedQuizzInvitations />
      }
    </div>
  );
}

export default MenuWrapper(QuizzInvitations)
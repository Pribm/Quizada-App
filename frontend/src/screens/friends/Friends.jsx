import * as React from 'react';
import MenuWrapper from 'components/wrappers/MenuWrapper';
import { Button, ButtonGroup, Grid } from '@mui/material';
import { FriendsListComponent } from './FriendsListComponent';
import FriendCardLarge from 'components/friendsCards/FriendCardLarge2';
import { useState } from 'react';
import FriendshipInvitations from './FriendshipInvitations';
import { useLocation } from 'react-router-dom';




const Friends = () => {

  const location = useLocation()

  const [state, setState] = useState({
    showFriendsList: true,
    showFriendsInvitations: false,
  })

  React.useEffect(() => {
    let url = new URLSearchParams(location.search)
    let urlParams = Object.fromEntries(url.entries());

    if(urlParams?.requests){
      setState({
        showFriendsList: false,
        showFriendsInvitations: true,
      })
    }
  }, [])

  return (
    <div className="container mx-auto  p-4 md:w-[500px]">
          <ButtonGroup fullWidth variant="contained" aria-label="outlined primary button group">
            <Button
              onClick={() => setState({
                showFriendsList: true,
                showFriendsInvitations: false,
              })}
            >Sua lista de Amigos</Button>
            <Button
              onClick={() => setState({
                showFriendsList: false,
                showFriendsInvitations: true,
              })}
            >Solicitações de Amizade</Button>
          </ButtonGroup>
          {
            state.showFriendsList &&
            <FriendsListComponent Component={FriendCardLarge}/>
          }
          {
            state.showFriendsInvitations &&
            <FriendshipInvitations Component={FriendCardLarge}/>
          }
    </div>
  );
}

export default MenuWrapper(Friends)
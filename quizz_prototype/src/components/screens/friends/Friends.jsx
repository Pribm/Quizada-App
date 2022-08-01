import * as React from 'react';
import MenuWrapper from 'components/wrappers/MenuWrapper';
import { Grid } from '@mui/material';
import { FriendsListComponent } from './FriendsListComponent';
import FriendCardLarge from 'components/friendsCards/FriendCardLarge';




const Friends = () => {
  return (
    <div className="container mx-auto p-4">
      <Grid container spacing={4} className='justify-center'>
        <Grid item xs={12} md={4}>
          <FriendsListComponent Component={FriendCardLarge}/>
        </Grid>  
      </Grid>
    </div>
  );
}

export default MenuWrapper(Friends)
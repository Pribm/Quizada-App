import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import MenuWrapper from 'components/wrappers/MenuWrapper';
import { useDispatch, useSelector } from 'react-redux';
import {  index } from 'store/Actions/friends.action';
import { Avatar, Button, CircularProgress, Paper, TextField } from '@mui/material';
import { getUserThumbnail } from 'utils/getThumbnails';
import { SearchBox } from 'components/searchBox/SearchBox';
import { IoSend } from 'react-icons/io5';



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}

    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div >{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const Friends = () => {

  const dispatch = useDispatch()
  const { yourFriends } = useSelector(state => state.friendsReducer)

  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    dispatch(index({ showFriendsList: true }))
    dispatch(index({ showUserFriendshipRequests: true }))
  }, [])

  const TabPanelFriends = (value, list, index, ButtonComponent) => React.useMemo(() => (
    <TabPanel value={value} index={index} dir={theme.direction} >
      {list.data.length > 0 ?
        list.data.map((friend, i) => (
          <Paper key={'your_friend_' + i} className='min-h-[100px] flex flex-col items-center mb-4 py-4' elevation={2}>
            <Avatar src={friend.avatar ? getUserThumbnail(friend.avatar, friend.id) : ''} alt={friend.name} className='mr-4' />
            <p>{friend.name}</p>
            <p className='text-sm'>{friend.email}</p>
            {
              ButtonComponent &&
              ButtonComponent(friend)
            }
          </Paper>
        ))
        :
        <div className='flex justify-center'><CircularProgress /></div>}
    </TabPanel>
  ), [list, value, ButtonComponent])

  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className='flex justify-center'>
      <Box className='overflow-y-scroll min-h-[600px] hideScroll relative' sx={{ bgcolor: 'background.paper', maxWidth: '90vw', maxHeight: '70vh', minHeight: '70vh' }}>
        <AppBar position="sticky" className='top-0'>
          <div className='p-4'>
            <SearchBox
              placeholder="Procurar Amigos"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Convidar para quizz" {...a11yProps(0)} />
            <Tab label="Convites de Quizz" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
          className='bg-slate-50 min-h-full'
        >
          {TabPanelFriends(value, yourFriends, 0, (user) => (
            <TextField
              className='mt-2'
              label='Enviar Token'
              size='small'
              InputProps={{
                endAdornment: (<IoSend size={20} className='text-blue-500 cursor-pointer'/>)
              }}
            />
          ))}

          <TabPanel value={value} index={1} dir={theme.direction}>
            Item Three
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}

export default MenuWrapper(Friends)
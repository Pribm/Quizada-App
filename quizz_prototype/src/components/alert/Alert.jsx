import React from 'react'
import Snackbar from '@mui/material/Snackbar';

import Slide from '@mui/material/Slide';

import MuiAlert from '@mui/material/Alert';

import {useSelector, useDispatch} from'react-redux'
import { changeAlert } from '../../store/Actions/alert.action';

const SlideTransition = (SlideProps) => {
    return <Slide {...SlideProps} direction="up" />;
}

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackAlert = () => {

    const state = useSelector(state => state.alertReducer)
    const dispatch = useDispatch()

  return (
    <Snackbar
        open={state.open}
        onClose={() => dispatch(changeAlert({open:false}))}
        anchorOrigin={{horizontal: 'center', vertical: 'bottom'}}
        TransitionComponent={SlideTransition}
        autoHideDuration={state.autoHideDuration}
    >
        <Alert severity={state.class}>{state.msg}</Alert>
    </Snackbar>
  )
}

export default SnackAlert
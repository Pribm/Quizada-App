import {createTheme}  from '@mui/material/styles';

const mainTheme = createTheme({
    palette: {
        primary: {
            main: '#566bf3',
            light: '#08bcff',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#ff6200',
        },
    },
})

export default mainTheme
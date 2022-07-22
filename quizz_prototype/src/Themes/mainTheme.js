import { orange, red } from '@mui/material/colors';
import {createTheme}  from '@mui/material/styles';

const mainTheme = createTheme({
    palette: {
        primary: {
            main: '#566bf3 !important',
            light: '#08bcff !important',
            contrastText: '#ffffff !important',
        },
        secondary: {
            main: `${orange[800]} !important`,
        },
        error: {
            main: `${red[600]} !important`,
            dark: `${red[700]} !important`
        }
    },
    components: {
        MuiButton: {
            variants: [
                {
                    props: {variant: 'contained'},
                },
            ]
        },
    }
})

export default mainTheme
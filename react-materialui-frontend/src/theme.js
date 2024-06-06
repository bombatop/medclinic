import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#237DD1',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: "Montserrat, Raleway, Open Sans, sans-serif"
    },
});

export default theme;
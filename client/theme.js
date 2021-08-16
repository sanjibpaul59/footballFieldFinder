import { createMuiTheme } from '@material-ui/core/styles'
import { green, pink } from '@material-ui/core/colors'

const theme = createMuiTheme({
  breakpoints: {
    keys: {
      0: 'xs',
      1: 'sm',
      2: 'md',
      3: 'lg',
      4: 'xl',
    },
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    useNextVariants: true,
    fontFamily: 'Noto Sans JP',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    body1: {
      fontWeight: 400,
    },
  },
  palette: {
    primary: {
      light: '#5c67a3',
      main: '#3f4771',
      dark: '#2e355b',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff79b0',
      main: '#ff4081',
      dark: '#c60055',
      contrastText: '#000',
    },
    aboutDescription: '#2e7d32',
    openTitle: '#3f4771',
    protectedTitle: green['900'],
    type: 'light',
  },
})

export default theme

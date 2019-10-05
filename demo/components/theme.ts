import { indigo, red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#000',
    },
    secondary: {
      main: indigo[500],
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

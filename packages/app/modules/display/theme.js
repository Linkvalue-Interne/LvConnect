import { createMuiTheme } from '@material-ui/core/styles';
import { blue, lightBlue } from '@material-ui/core/colors';

export default createMuiTheme({
  palette: { primary: blue, secondary: lightBlue },
  custom: {
    drawerWidth: '300px',
  },
  typography: {
    useNextVariants: true,
  },
});

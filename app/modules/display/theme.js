import { createMuiTheme } from 'material-ui';
import { blue, lightBlue } from 'material-ui/colors';

export default createMuiTheme({
  palette: { primary: blue, secondary: lightBlue },
  custom: {
    drawerWidth: '300px',
  },
});

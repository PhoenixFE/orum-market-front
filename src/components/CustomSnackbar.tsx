import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type Severity = 'success' | 'info' | 'warning' | 'error';

interface ICustomSnackbar {
  open: boolean;
  message: string;
  handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  severity?: Severity;
}

const CustomSnackbar: React.FC<ICustomSnackbar> = ({
  open,
  message,
  handleClose,
  severity,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Centered at the top
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function MobilePaymentBar({ totalCost }: { totalCost: number }) {
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handlePaymentClick = () => {
    navigate('/checkout');
  };

  const formattedTotalCost = totalCost.toLocaleString('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  });

  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      {matchesXS && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0, // Height of your mobile nav bar
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            borderRadius: 0,
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
            height: '70px',
          }}
          elevation={0}
        >
          <Button
            variant="contained"
            sx={{
              margin: theme.spacing(1),
              backgroundColor: 'primary', // Match the background color to your design
              color: '#fff', // Match the text color to your design
              width: 'calc(100% - 16px)', // Full width with padding
              maxWidth: theme.breakpoints.values.sm, // Max width at small breakpoint
              fontSize: '1rem',
              fontWeight: 700,
            }}
            onClick={handlePaymentClick}
          >
            {formattedTotalCost} 주문하기
          </Button>
        </Paper>
      )}
    </Box>
  );
}

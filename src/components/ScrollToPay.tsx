import * as React from 'react';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import CustomTooltip from './CustomTooltip';

interface Props {
  onPay: () => void; // Function to call when the pay button is clicked
}

export default function ScrollToPay(props: Props) {
  const { onPay } = props;

  // Use the scroll trigger to determine when the button should become visible
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100, // Adjust the threshold as needed
  });

  const handleClick = (_: React.MouseEvent<HTMLDivElement>) => {
    onPay(); // Call the provided onPay function when the button is clicked
  };

  return (
    <CustomTooltip title="결제하기">
      <Fade in={trigger}>
        <Box
          onClick={handleClick}
          role="presentation"
          sx={{
            position: 'fixed',
            bottom: { xs: 56, sm: 100 },
            left: 0,
            zIndex: 1100,
            backgroundColor: 'white',
          }}
        >
          <Button variant="text" color="inherit" sx={{}}>
            결제하기
          </Button>
        </Box>
      </Fade>
    </CustomTooltip>
  );
}

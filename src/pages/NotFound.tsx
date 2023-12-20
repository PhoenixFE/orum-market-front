import { Typography, Box } from '@mui/material';

export default function () {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="error.main"
      color="white"
    >
      <Typography variant="h3">페이지를 찾을 수 없습니다.</Typography>
    </Box>
  );
}

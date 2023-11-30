import { CssBaseline } from '@mui/material';
import { Box } from '@mui/system';
import ProductList from './product/ProductList';

export default function Home() {
  return (
    <Box sx={{ display: 'flex', marginTop: '7rem' }}>
      <CssBaseline />
      <ProductList />
    </Box>
  );
}

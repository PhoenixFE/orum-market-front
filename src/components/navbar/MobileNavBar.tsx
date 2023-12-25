import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import Paper from '@mui/material/Paper';
import { useMediaQuery } from '@mui/material';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../lib/store';

export default function MobileNavBar() {
  const theme = useTheme();
  const { items: cartItems } = useCart();
  const cartItemsCount = cartItems.length;
  const matchesXS = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const routeToValueMap: { [key: string]: number } = {
    '/': 0,
    '/search': 1,
    '/cart': 2,
    '/user': 3,
  };

  const currentValue = routeToValueMap[location.pathname];

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/search');
        break;
      case 2:
        navigate('/cart');
        break;
      case 3:
        navigate('/user');
        break;
    }
  };

  return (
    <Box sx={{ pb: 7 }}>
      <CssBaseline />
      {matchesXS && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: '1px solid rgba(0, 0, 0, 0.12)',
          }}
          elevation={0}
        >
          <BottomNavigation
            value={currentValue}
            onChange={handleChange}
            showLabels
          >
            <BottomNavigationAction label="홈" icon={<HomeIcon />} />
            <BottomNavigationAction label="검색" icon={<SearchIcon />} />
            <BottomNavigationAction
              label="장바구니"
              icon={
                <StyledBadge badgeContent={cartItemsCount} color="error">
                  <ShoppingCartIcon />
                </StyledBadge>
              }
            />
            <BottomNavigationAction label="마이" icon={<PersonIcon />} />
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

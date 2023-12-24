import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { useMediaQuery } from '@mui/material';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useCart } from '../lib/store';

const refreshMessages = () => [];

export default function MobileNavBar() {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(() => refreshMessages());
  const theme = useTheme();
  const { items: cartItems } = useCart();
  const cartItemsCount = cartItems.length;
  const matchesXS = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleNavigateToCart = () => {
    navigate('/cart');
  };

  React.useEffect(() => {
    if (ref.current) {
      ref.current.ownerDocument.body.scrollTop = 0;
    }
    setMessages(refreshMessages());
  }, [value, setMessages]);

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <List>
        {messages.map(({ primary, secondary, person }, index) => (
          <ListItem button key={index + person}>
            <ListItemAvatar>
              <Avatar alt="Profile Picture" src={person} />
            </ListItemAvatar>
            <ListItemText primary={primary} secondary={secondary} />
          </ListItem>
        ))}
      </List>
      {matchesXS && (
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={value}
            onChange={(_, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction
              label="장바구니"
              icon={
                <StyledBadge badgeContent={cartItemsCount} color="error">
                  <ShoppingCartIcon />
                </StyledBadge>
              }
              onClick={handleNavigateToCart}
            />
            <BottomNavigationAction
              label="Cart"
              icon={<ShoppingCartIcon />}
              onClick={handleNavigateToCart}
            />
            <BottomNavigationAction
              label="Cart"
              icon={<ShoppingCartIcon />}
              onClick={handleNavigateToCart}
            />
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

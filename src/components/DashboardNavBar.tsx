import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import { useEffect, useState } from 'react';

export default function DashboardNavBar({ dashboardMenu }) {
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState('');

  useEffect(() => {
    setSelectedMenu(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Grid item xs={3}>
        <Toolbar />
        <Divider />
        <List>
          <Box sx={{ padding: '20px 16px 8px' }}>
            <Typography variant="h6" fontWeight={700}>
              구매자
            </Typography>
          </Box>
          {dashboardMenu.buyer.map((items) => (
            <ListItem key={items.id} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {items.id % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <Link
                  to={items.url}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <ListItemText
                    primary={items.title}
                    primaryTypographyProps={{
                      fontSize: '16',
                      letterSpacing: 0,
                      fontWeight:
                        selectedMenu === items.url ? 'bold' : 'medium',
                    }}
                    onClick={() => setSelectedMenu(items.url)}
                  />
                </Link>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <Box sx={{ padding: '20px 16px 8px' }}>
            <Typography variant="h6" fontWeight={700}>
              판매자
            </Typography>
          </Box>
          {dashboardMenu.seller.map((items) => (
            <ListItem key={items.id} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {items.id % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <Link
                  to={items.url}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <ListItemText
                    primary={items.title}
                    primaryTypographyProps={{
                      fontSize: '16',
                      letterSpacing: 0,
                      fontWeight:
                        selectedMenu === items.url ? 'bold' : 'medium',
                    }}
                    onClick={() => setSelectedMenu(items.url)}
                  />
                </Link>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Grid>
    </>
  );
}

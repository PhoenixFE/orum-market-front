import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { IDashboardMenu } from '../type';

export default function DashboardNavBar({ dashboardMenu }: IDashboardMenu) {
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
                  <KeyboardArrowRightIcon
                    style={{
                      color:
                        selectedMenu === items.url ? 'inherit' : 'darkgray',
                    }}
                  />
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
                      fontWeight: selectedMenu === items.url ? '700' : '300',
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
                  <KeyboardArrowRightIcon
                    style={{
                      color:
                        selectedMenu === items.url ? 'inherit' : 'darkgray',
                    }}
                  />
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
                      fontWeight: selectedMenu === items.url ? '700' : '300',
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

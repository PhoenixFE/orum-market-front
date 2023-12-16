import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, Outlet } from 'react-router-dom';
import { DASHBOARD_MENU } from '../../constants';
import { Grid } from '@mui/material';

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

export default function Dashboard(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedBuyerMenu, setSelectedBuyerMenu] = React.useState(
    DASHBOARD_MENU.buyer[0].title,
  );
  const [selectSellerMenu, setSelectSellerMenu] = React.useState('');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSelectBuyerMenu = (itemBuyerTitle: string) => {
    setSelectedBuyerMenu(itemBuyerTitle);
    setSelectSellerMenu('');
  };

  const handleSelectSellerMenu = (itemSellerTitle: string) => {
    setSelectSellerMenu(itemSellerTitle);
    setSelectedBuyerMenu('');
  };

  const drawer = (
    <Grid item xs={3}>
      <Toolbar />
      <Divider />
      <List>
        {DASHBOARD_MENU.buyer.map((items) => (
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
                    fontWeight:
                      selectedBuyerMenu === items.title ? 'bold' : 'medium',
                    letterSpacing: 0,
                  }}
                  onClick={() => handleSelectBuyerMenu(items.title)}
                />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {DASHBOARD_MENU.seller.map((items) => (
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
                    fontWeight:
                      selectSellerMenu === items.title ? 'bold' : 'medium',
                    letterSpacing: 0,
                  }}
                  onClick={() => handleSelectSellerMenu(items.title)}
                />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Grid>
  );

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        component="nav"
        position="fixed"
        color="inherit"
        sx={{
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Link to="/" style={{ alignItems: 'center' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <img
                src="../../assets/logo.png"
                alt="ORUM"
                style={{ width: '100px', height: 'auto' }}
              />
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="dashboard"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, Outlet } from 'react-router-dom';
import { DASHBOARD_MENU } from '../../constants';
import DashboardNavBar from '../../components/DashboardNavBar';
import MobileNavBar from '../../components/navbar/MobileNavBar';

const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

export default function Dashboard(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const role = localStorage.getItem('role');
  const dashboardMenu = React.useMemo(() => {
    if (role === 'seller') {
      return {
        buyer: DASHBOARD_MENU.buyer,
        seller: DASHBOARD_MENU.seller,
      };
    } else if (role === 'user') {
      return {
        buyer: DASHBOARD_MENU.buyer,
        seller: [],
      };
    } else {
      return {
        buyer: [],
        seller: [],
      };
    }
  }, [role]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = <DashboardNavBar dashboardMenu={dashboardMenu} />;

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
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
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
          paddingX: 4,
          paddingY: 3.7,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
        <MobileNavBar />
      </Box>
    </Box>
  );
}

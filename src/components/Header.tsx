import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  Badge,
  Box,
  Button,
  CssBaseline,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  styled,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  ShoppingCart as ShoppingCartIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Logout,
} from '@mui/icons-material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LoginIcon from '@mui/icons-material/Login';
import { useCart, useUserStore } from '../lib/store';
import { IUserStore } from '../type';
import { ColorModeContext } from '../App';

// 메인 헤더 컴포넌트
export default function Header() {
  const { isLoggedIn, logOut } = useUserStore() as IUserStore;
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { items: cartItems } = useCart();
  const cartItemsCount = cartItems.length;
  const _id = localStorage.getItem('_id');

  const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleDashboard = () => {
    navigate(`/user/${_id}`);
    handleMenuClose();
  };
  const handleLogoutDialogOpen = () => {
    setOpenLogoutDialog(true);
  };
  const handleLogoutDialogClose = () => {
    setOpenLogoutDialog(false);
  };
  const handleLogout = () => {
    logOut();
    alert('로그아웃 되었습니다. 다음에 또 만나요!');
    setOpenLogoutDialog(false);
    navigate('/');
  };

  // 로그인한 유저일 경우 보여줄 버튼
  function isLoggedInUserButton() {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <IconButton color="inherit">
          <Badge badgeContent={4} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Link to="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>
          <IconButton color="inherit">
            <Badge badgeContent={cartItemsCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Link>
        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleAvatarClick}
          color="inherit"
        >
          <Avatar alt="User Avatar" src="/path/to/your/avatar.jpg" />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleDashboard}>대시보드</MenuItem>
          <MenuItem onClick={handleLogoutDialogOpen}>로그아웃</MenuItem>
          <LogoutDialog
            open={openLogoutDialog}
            onClose={handleLogoutDialogClose}
            onConfirm={handleLogout}
          />
        </Menu>
      </Box>
    );
  }

  // 로그인하지 않은 유저일 경우 보여줄 버튼
  function notLoggedInUserButton() {
    return (
      <Box gap={2} sx={{}}>
        <Button
          variant="text"
          color="inherit"
          component={Link}
          to="/sign-in"
          style={{ fontWeight: 'normal' }}
        >
          <LoginIcon style={{ marginRight: '0.4rem', fontSize: '1rem' }} />{' '}
          {'로그인'}
        </Button>
        <Button
          variant="text"
          component={Link}
          to="/sign-up"
          color="inherit"
          style={{ fontWeight: 'normal' }}
        >
          <PersonOutlineIcon
            style={{ marginRight: '0.1rem', fontSize: '1rem' }}
          />
          회원가입
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        component="nav"
        color="inherit"
        sx={{
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          zIndex: theme.zIndex.drawer + 2,
        }}
      >
        <ToolbarStyled>
          <Link to="/" style={{ alignItems: 'center' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <img
                src="../../assets/logo.png"
                alt="ORUM"
                style={{ width: '100px', height: 'auto' }}
              />
            </Typography>
          </Link>

          <Box
            sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}
          >
            <IconButton
              onClick={colorMode.toggleColorMode}
              color="inherit"
              style={{ marginRight: '0.1rem', fontSize: '1rem' }}
            >
              {theme.palette.mode === 'dark' ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
            {isLoggedIn ? isLoggedInUserButton() : notLoggedInUserButton()}
          </Box>
        </ToolbarStyled>
      </AppBar>
    </Box>
  );
}

// Styled components
const ToolbarStyled = styled(Toolbar)({
  justifyContent: 'space-between',
  alignItems: 'center',
});

interface ILogoutDialog {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// 로그아웃 다이얼로그 컴포넌트
function LogoutDialog({ open, onClose, onConfirm }: ILogoutDialog) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'로그아웃'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          정말로 로그아웃 하시겠습니까?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          취소
        </Button>
        <Button
          startIcon={<Logout />}
          onClick={onConfirm}
          color="inherit"
          autoFocus
        >
          로그아웃
        </Button>
      </DialogActions>
    </Dialog>
  );
}

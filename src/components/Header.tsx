import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Menu,
  MenuItem,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useUserStore } from '../lib/store';
import React, { useRef, useState } from 'react';
import { Logout } from '@mui/icons-material';
import { IUserStore } from '../type';
import useOutsideClick from '../hooks/useOutsideClick';
import CategoryNavBar from './CategoryNavBar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function Header() {
  const { isLoggedIn, logOut } = useUserStore() as IUserStore;
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryNavBar, setShowCategoryNavBar] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const headerRef = useRef(null);
  useOutsideClick(headerRef, () => {
    if (showCategoryNavBar) {
      setShowCategoryNavBar(false);
    }
  });

  const toggleCategoryNavBar = () => {
    setShowCategoryNavBar(!showCategoryNavBar);
  };

  const handleDashboard = () => {
    navigate(`/user/${_id}`); // Navigate to dashboard route
    handleMenuClose();
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let queryParam = `?query=${searchQuery}`;
    navigate(`/search${queryParam}`);
    setSearchQuery('');
  };

  const _id = localStorage.getItem('_id');

  const handleLogoutDialogOpen = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogoutDialogClose = () => {
    setOpenLogoutDialog(false);
  };

  const handleLogout = () => {
    logOut();
    localStorage.removeItem('token');
    alert('로그아웃 되었습니다. 다음에 또 만나요!');
    setOpenLogoutDialog(false);
    navigate('/');
  };

  const { items: cartItems } = useCart();
  const cartItemsCount = cartItems.length;

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
            {/* <Avatar alt="Remy Sharp" src="/broken-image.jpg" /> */}
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
            vertical: 'top',
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

  function notLoggedInUserButton() {
    return (
      <>
        <Link to="/sign-in">
          <Button variant="text" color="inherit">
            로그인
          </Button>
        </Link>
        <Link to="sign-up">
          <Button variant="text" color="inherit">
            회원가입
          </Button>
        </Link>
      </>
    );
  }

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            justifyContent: 'space-between',
          }}
        >
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              ORUM
            </Typography>
          </Link>

          <Button onClick={toggleCategoryNavBar} variant="text" color="inherit">
            쇼핑하기
            {showCategoryNavBar ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <form onSubmit={handleSearch}>
              <Search sx={{ marginRight: '16px' }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="검색해볼까"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            </form>

            {isLoggedIn && isLoggedInUserButton()}
            {!isLoggedIn && notLoggedInUserButton()}
          </Box>
        </Toolbar>
      </Container>
      {showCategoryNavBar && <CategoryNavBar />}
    </AppBar>
  );
}

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function LogoutDialog({ open, onClose, onConfirm }: LogoutDialogProps) {
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
        <Button onClick={onClose} color="primary">
          취소
        </Button>
        <Button
          startIcon={<Logout />}
          onClick={onConfirm}
          color="primary"
          autoFocus
        >
          로그아웃
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  marginRight: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

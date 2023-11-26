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
import { Badge, Button, Container } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../lib/store';
import { useState } from 'react';
import { Logout } from '@mui/icons-material';
import { UserStore } from '../lib/store';

export default function Header() {
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const { isLoggedIn, logOut }: UserStore = useUserStore();

  const navigate = useNavigate();

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
    localStorage.removeItem('token');
    navigate('/');
  };

  function isLoggedInUserButton() {
    return (
      <>
        <Link to="/user/1" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Button variant="text" color="inherit">
            대시보드
          </Button>
        </Link>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="error">
            {/* <Avatar alt="Remy Sharp" src="/broken-image.jpg" /> */}
            <NotificationsIcon />
          </Badge>
        </IconButton>
        {/* 로그아웃 버튼은 아바타 클릭 후 생성되는 모달 안으로 이동 시킬 것 */}
        <Button onClick={handleLogoutDialogOpen} variant="text" color="inherit">
          로그아웃
        </Button>
        <LogoutDialog
          open={openLogoutDialog}
          onClose={handleLogoutDialogClose}
          onConfirm={handleLogout}
        />
      </>
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
    <Container maxWidth="sm">
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: 'block', textAlign: 'left' }}
            >
              ORUM
            </Typography>
          </Link>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          {isLoggedIn && isLoggedInUserButton()}
          {!isLoggedIn && notLoggedInUserButton()}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Container>
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

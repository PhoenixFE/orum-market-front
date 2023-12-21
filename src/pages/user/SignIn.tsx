import { useState } from 'react';
import { api } from '../../api/api';
import { useUserStore } from '../../lib/store';
import { Login, Visibility, VisibilityOff } from '@mui/icons-material';
import styled from 'styled-components';
import {
  TextField,
  Button,
  Container,
  InputAdornment,
  IconButton,
  Box,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../lib/validation';
import { IUserStore } from '../../type';
import CustomSnackbar from '../../components/CustomSnackbar';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { logIn } = useUserStore() as IUserStore;
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let isValid = true;

    if (!validateEmail(email)) {
      setSnackbarMessage(
        '로그인에 실패하였습니다. 이메일 혹은 비밀번호를 확인해주세요.',
      );
      setSnackbarOpen(true);
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setSnackbarMessage(
        '로그인에 실패하였습니다. 이메일 혹은 비밀번호를 확인해주세요.',
      );
      setSnackbarOpen(true);
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!isValid) return;

    try {
      const response = await api.signIn({ email, password });
      logIn(
        response.data.item.token.accessToken,
        response.data.item.token.refreshToken,
      );
      localStorage.setItem('_id', response.data.item._id);
      setLoginSuccess(true);
      setSnackbarMessage('로그인에 성공하였습니다. 메인 페이지로 이동합니다.');
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error(error);
      setSnackbarMessage(
        '로그인에 실패하였습니다. 이메일 혹은 비밀번호를 확인해주세요.',
      );
      setSnackbarOpen(true);
      setLoginSuccess(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: '100vh-114px',
        marginY: '50px',
        borderRadius: '10px',
        background: 'primary.main',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>로그인</h1>
      <Form onSubmit={handleSubmit} id="sign-in-form">
        <TextField
          id="email"
          name="email"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
          autoComplete="email"
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={!!passwordError}
          helperText={passwordError}
        />
        <Button
          type="submit"
          variant="outlined"
          fullWidth
          startIcon={<Login />}
          sx={{ mt: 3, mb: 2, height: '56px' }}
        >
          로그인
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Link to="/sign-up">
            <Button
              variant="text"
              style={{ textDecoration: 'none', marginTop: '8px' }}
            >
              회원가입하러 가기
            </Button>
          </Link>
        </Box>
      </Form>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        handleClose={() => setSnackbarOpen(false)}
        severity={loginSuccess ? 'success' : 'error'}
      />
    </Container>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

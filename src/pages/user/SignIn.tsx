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
  Snackbar,
  Alert,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../lib/validation';
import { IUserStore } from '../../type';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { logIn } = useUserStore() as IUserStore;
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const navigate = useNavigate();

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError('유효하지 않은 이메일 형식입니다.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError('비밀번호 양식에 맞지 않는 걸');
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
      alert('로그인에 성공하였습니다. 어서오세요.');
      navigate('/');
    } catch (error) {
      console.error(error);
      setSnackbarMessage(
        '로그인에 실패하였습니다. 이메일 혹은 비밀번호를 확인해주세요.',
      );
      setSnackbarOpen(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
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
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<Login />}
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Link to="/sign-up">
          <Button
            variant="text"
            style={{ textDecoration: 'none', marginTop: '8px' }}
          >
            회원가입하러 가기
          </Button>
        </Link>
      </Form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin-top: 8vh;
`;

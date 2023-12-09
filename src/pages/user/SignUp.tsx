import { useState } from 'react';
import { api } from '../../api/api';
import styled from 'styled-components';
import {
  TextField,
  MenuItem,
  Button,
  Container,
  InputAdornment,
  IconButton,
  FormHelperText,
  Box,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import { validateEmail, validatePassword } from '../../lib/validation';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    type: 'user',
    extra: {
      membershipClass: 'MC01',
    },
  });
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'email') {
      setIsEmailAvailable(false);
      if (!validateEmail(value)) {
        setEmailError('유효하지 않은 이메일 형식입니다.');
      } else {
        setEmailError('');
      }
    }

    if (name === 'password') {
      if (!validatePassword(value)) {
        setPasswordError('비밀번호는 8자 이상이어야 합니다.');
      } else {
        setPasswordError('');
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.signUp(formData);
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/sign-in');
    } catch (error) {
      console.error(error);
    }
  };

  const checkEmailAvailability = async () => {
    try {
      setIsCheckingEmail(true);
      const response = await fetch(
        `https://localhost/api/users/email?email=${encodeURIComponent(
          formData.email,
        )}`,
      );
      const data = await response.json();
      if (data.ok === 1) {
        setIsEmailAvailable(true);
        setEmailError('');
      } else if (data.ok === 0) {
        setIsEmailAvailable(false);
        setEmailError(data.message || '이미 등록된 이메일입니다.');
      }
    } catch (error) {
      console.error(error);
      setEmailError('이메일 확인에 실패했습니다.');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ height: '100%', marginY: '100px' }}
    >
      <Form onSubmit={handleSubmit}>
        <Box sx={{ width: '100%' }}>
          <TextField
            type="email"
            name="email"
            variant="filled"
            label="이메일"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            required
            error={!!emailError}
            helperText={emailError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="check email availability"
                    onClick={checkEmailAvailability}
                    edge="end"
                    disabled={
                      isCheckingEmail ||
                      formData.email === '' ||
                      !validateEmail(formData.email) ||
                      isEmailAvailable // Disable button if email has been checked and is available
                    }
                  >
                    {isCheckingEmail ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : isEmailAvailable ? (
                      <CheckIcon color="success" />
                    ) : (
                      <CheckIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            FormHelperTextProps={{
              sx: {
                color: isEmailAvailable ? 'success.main' : '',
              },
            }}
          />
          {isEmailAvailable && !emailError && (
            <FormHelperText sx={{ color: 'success.main' }}>
              사용 가능한 이메일입니다.
            </FormHelperText>
          )}
        </Box>
        <TextField
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="비밀번호"
          variant="filled"
          value={formData.password}
          onChange={handleChange}
          required
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
        <TextField
          name="name"
          label="이름"
          variant="filled"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          name="type"
          select
          variant="filled"
          label="유형"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <MenuItem value="user">구매자</MenuItem>
          <MenuItem value="seller">판매자</MenuItem>
        </TextField>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
          }}
        >
          <SubmitButton
            variant="contained"
            type="submit"
            sx={{ width: '100%' }}
            disabled={!isEmailAvailable || isCheckingEmail}
          >
            일반 회원가입
          </SubmitButton>
        </Box>
      </Form>
    </Container>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const SubmitButton = styled(Button)`
  margin-top: 20px;
`;

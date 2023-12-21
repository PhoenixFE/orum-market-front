import { useState } from 'react';
import { api } from '../../api/api';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../lib/validation';

import {
  TextField,
  MenuItem,
  Button,
  Container,
  InputAdornment,
  IconButton,
  FormHelperText,
  Box,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

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
      const response = await api.checkEmail(formData.email);
      const data = response.data;
      if (data.ok === 1) {
        setIsEmailAvailable(true);
        setEmailError('');
      } else if (data.ok === 0) {
        setIsEmailAvailable(false);
        setEmailError(data.message || '이미 등록된 이메일입니다.');
      }
    } catch (error) {
      console.error(error);
      if ((error as Error & { response?: any }).response) {
        setEmailError(
          (error as Error & { response?: any }).response?.data.message,
        );
      } else {
        setEmailError('이메일 확인에 실패했습니다.');
      }
    } finally {
      setIsCheckingEmail(false);
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
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>회원가입</h1>
      <Form onSubmit={handleSubmit}>
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={1} alignItems="flex-start">
            <Grid item xs={true}>
              <TextField
                type="email"
                name="email"
                label="이메일"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                required
                error={!!emailError}
                helperText={emailError}
              />
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                size="large"
                aria-label="check email availability"
                onClick={checkEmailAvailability}
                disabled={
                  isCheckingEmail ||
                  formData.email === '' ||
                  !validateEmail(formData.email) ||
                  isEmailAvailable
                }
                sx={{ height: '56px' }}
              >
                {isCheckingEmail ? (
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <Typography>
                      {isEmailAvailable ? (
                        <CheckIcon sx={{ color: 'success.main' }} />
                      ) : (
                        '이메일 중복 확인'
                      )}
                    </Typography>
                  </>
                )}
              </Button>
            </Grid>
          </Grid>
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
          variant="outlined"
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
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          name="type"
          select
          variant="outlined"
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
            size="large"
            sx={{ width: '100%', marginTop: '20px' }}
            disabled={!isEmailAvailable || isCheckingEmail}
          >
            일반 회원가입
          </SubmitButton>
        </Box>
      </Form>

      <Box sx={{ my: 5 }}>
        <Typography variant="h6" gutterBottom color="text.secondary">
          회원 가입 혜택
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper
              variant="outlined"
              sx={{ p: 2, textAlign: 'center', height: '100px' }}
            >
              <LocalActivityOutlinedIcon />
              <Typography color="text.secondary">쿠폰</Typography>
              <Typography variant="caption" color="text.secondary">
                등급별 쿠폰, 생일 쿠폰 등
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              variant="outlined"
              sx={{ p: 2, textAlign: 'center', height: '100px' }}
            >
              <SavingsOutlinedIcon />
              <Typography color="text.secondary">마일리지 적립</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              variant="outlined"
              sx={{ p: 2, textAlign: 'center', height: '100px' }}
            >
              <ReceiptOutlinedIcon />
              <Typography color="text.secondary">리뷰 적립</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              variant="outlined"
              sx={{ p: 2, textAlign: 'center', height: '100px' }}
            >
              <LocalShippingOutlinedIcon />
              <Typography color="text.secondary">무료 배송 제공</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
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

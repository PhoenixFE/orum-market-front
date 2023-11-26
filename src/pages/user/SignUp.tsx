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
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { validateEmail, validatePassword } from '../../lib/validation';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    type: 'user',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'email') {
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

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Form onSubmit={handleSubmit}>
        <TextField
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          required
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
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
          label="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          name="type"
          select
          label="Type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="seller">Seller</MenuItem>
        </TextField>

        <SubmitButton
          startIcon={<PersonAddIcon />}
          variant="contained"
          type="submit"
        >
          Sign Up
        </SubmitButton>
        <Link to="/sign-in">
          <Button variant="text">로그인하러 가기</Button>
        </Link>
      </Form>
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

const SubmitButton = styled(Button)`
  margin-top: 20px;
`;

import React, { useState } from 'react';
import {
  Avatar,
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  Link,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { login } from '../../../services/auth/auth';
import { saveToken } from '../../../utility/common';
import { useSnackbar } from 'notistack';

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(formData);
      if (response.status === 200) {
        const responseData = response.data;
        saveToken(responseData.jwtToken);
        navigate('/dashboard');
        enqueueSnackbar(`Welcome back, ${responseData.name}!`, { variant: 'success', autoHideDuration: 5000 });
      }
    } catch (error) {
      enqueueSnackbar('Incorrect email or password. Please try again.', { variant: 'error', autoHideDuration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Paper
            elevation={0}
            className="premium-card"
            sx={{
              p: { xs: 3, md: 5 },
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LoginOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" sx={{ mb: 1, textAlign: 'center' }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              Enter your credentials to access your account.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleInputChange}
                className="custom-textfield"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                className="custom-textfield"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="glass-button"
                sx={{ mt: 4, mb: 3 }}
                disabled={!formData.email || !formData.password || loading}
              >
                {loading ? <CircularProgress color="inherit" size={24} /> : 'Sign In'}
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Don't have an account?{' '}
                    <Link
                      onClick={() => navigate('/register')}
                      sx={{
                        cursor: 'pointer',
                        color: 'primary.main',
                        fontWeight: 600,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Sign Up
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Container>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Login;
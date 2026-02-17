import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CircularProgress,
  Grid,
  Link,
  TextField,
  Box,
  Typography,
  Container,
  Backdrop,
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSnackbar } from 'notistack';
import { signup } from '../../../services/auth/auth';
import { saveToken } from '../../../utility/common';
import './Signup.css';

const Signup = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
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
      const response = await signup(formData);
      if (response.status === 201) {
        const responseData = response.data;
        saveToken(responseData.jwtToken);
        navigate('/dashboard');
        enqueueSnackbar(`Welcome ${responseData.name}!`, { variant: 'success', autoHideDuration: 5000 });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        enqueueSnackbar('Email already registered. Try logging in.', { variant: 'warning', autoHideDuration: 5000 });
      } else {
        enqueueSnackbar('An error occurred during signup. Please try again.', { variant: 'error', autoHideDuration: 5000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="sm">
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
              <PersonAddOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" sx={{ mb: 1, textAlign: 'center' }}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              Join us to start creating and participating in polls.
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              className="signup-card-fixed"
              sx={{ width: '100%', mt: 1 }}
            >
              {/* Row 1: Side by Side Fields */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="custom-textfield"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    name="lastName"
                    label="Last Name"
                    id="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="custom-textfield"
                  />
                </Grid>
              </Grid>

              {/* Row 2: Full Width Email */}
              <Box sx={{ mt: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="custom-textfield"
                />
              </Box>

              {/* Row 3: Full Width Password */}
              <Box sx={{ mt: 2 }}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
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
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="glass-button"
                sx={{ mt: 4, mb: 3 }}
                disabled={!formData.email || !formData.password || !formData.firstName || !formData.lastName || loading}
              >
                {loading ? <CircularProgress color="inherit" size={24} /> : 'Create Account'}
              </Button>

              <Grid container justifyContent="center">
                <Grid item>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Already have an account?{' '}
                    <Link
                      onClick={() => navigate('/login')}
                      sx={{
                        cursor: 'pointer',
                        color: 'primary.main',
                        fontWeight: 600,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Sign In
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

export default Signup;
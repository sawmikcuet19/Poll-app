import { Autocomplete, Avatar, Backdrop, Box, Button, Chip, CircularProgress, Container, CssBaseline, IconButton, InputAdornment, Paper, TextField, ThemeProvider, Typography, createTheme } from '@mui/material';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useNavigate } from 'react-router-dom';
import { postPoll } from '../../services/poll/poll';

const CreatePoll = () => {
  const [formData, setFormData] = useState({
    question: '',
    options: [],
    expiredAt: null
  });
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.options.length < 2) {
      enqueueSnackbar('Please add at least 2 options', { variant: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const obj = {
        question: formData.question,
        options: formData.options,
        expiredAt: formData.expiredAt ? formData.expiredAt.toDate() : null
      }
      const response = await postPoll(obj);
      if (response.status === 201) {
        navigate('/dashboard');
        enqueueSnackbar(`Poll posted successfully`, { variant: 'success', autoHideDuration: 5000 });
      }
    } catch (error) {
      enqueueSnackbar('Getting error while creating poll.', { variant: 'error', autoHideDuration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
              <HowToVoteIcon fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" sx={{ mb: 1, textAlign: 'center', fontWeight: 700 }}>
              Create Poll
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
              Ask a question and give options for people to vote.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                multiline
                rows={3}
                fullWidth
                required
                id="question"
                label="Enter Question"
                name="question"
                autoFocus
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Autocomplete
                multiple
                fullWidth
                options={[]}
                freeSolo
                value={formData.options}
                onChange={(event, newValue) => setFormData({ ...formData, options: newValue })}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={index}
                      sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin='normal'
                    label='Options (Press Enter to add)'
                    placeholder="Type and press enter"
                    name='options'
                  />
                )}
                sx={{ mb: 2 }}
              />
              <DateTimePicker
                label='Expiration date'
                value={formData.expiredAt}
                onChange={(date) => setFormData({ ...formData, expiredAt: date })}
                slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                className="glass-button"
                sx={{ mt: 4, mb: 2 }}
                disabled={!formData.question || formData.options.length < 2 || !formData.expiredAt || loading}
              >
                {loading ? <CircularProgress color='inherit' size={24} /> : 'Post Poll'}
              </Button>
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
    </LocalizationProvider>
  )
}

export default CreatePoll

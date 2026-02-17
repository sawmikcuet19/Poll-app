import { DeleteOutline, MoreVert, RemoveRedEye } from '@mui/icons-material';
import { Avatar, Backdrop, Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Grid, IconButton, MenuItem, Paper, Popover, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getMyPolls, deletePollById, postVoteOnPole } from '../../services/poll/poll';

const ViewMyPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const open = Boolean(anchorEl);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMyPolls();
      if (response.status === 200) {
        setPolls(response.data);
      }
    } catch (error) {
      enqueueSnackbar('Getting error while fetching poll.', { variant: 'error', autoHideDuration: 5000 });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeletePoll = async (pollId) => {
    handlePopoverClose();
    setLoading(true);
    try {
      await deletePollById(pollId);
      enqueueSnackbar(`Poll deleted successfully`, { variant: 'success', autoHideDuration: 5000 });
      fetchData();
    } catch (error) {
      enqueueSnackbar('Getting error while deleting poll.', { variant: 'error', autoHideDuration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handlePopoverOpen = (event, poll) => {
    setAnchorEl(event.currentTarget);
    setSelectedPoll(poll);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedPoll(null);
  };

  const handleAddVote = async (pollId, optionId) => {
    setLoading(true);
    try {
      const obj = {
        optionId: optionId,
        pollId: pollId
      }
      const response = await postVoteOnPole(obj);
      if (response.status === 200) {
        enqueueSnackbar(`Poll voted successfully`, { variant: 'success', autoHideDuration: 5000 });
        fetchData();
      }
    } catch (error) {
      enqueueSnackbar(`Error while posting the vote`, { variant: 'error', autoHideDuration: 5000 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3} direction="column" alignItems="center">
          {
            polls.length === 0 && !loading ? (
              <Box
                sx={{
                  mt: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}>
                <Typography variant='h6' color='text.secondary' gutterBottom>
                  You haven't created any polls yet
                </Typography>
                <Button
                  variant='contained'
                  className="glass-button"
                  onClick={() => navigate('/poll/create')}>
                  Create Your First Poll
                </Button>
              </Box>
            ) : (
              polls.map(poll => (
                <Grid item key={poll.id} xs={12} sm={8} sx={{ width: 450, maxWidth: '100%' }}>
                  <Card className="premium-card" sx={{ width: '100%', mt: 3, background: 'rgba(30, 41, 59, 0.7) !important' }}>
                    <CardHeader
                      avatar={
                        <Avatar sx={{ bgcolor: blue[500] }} aria-label='user'>
                          {poll.username.charAt(0)}
                        </Avatar>
                      }
                      action={
                        <>
                          <IconButton
                            aria-label='settings'
                            sx={{ color: 'white' }}
                            onClick={(e) => handlePopoverOpen(e, poll)}>
                            <MoreVert />
                          </IconButton>
                          <Popover
                            open={open && selectedPoll?.id === poll.id}
                            anchorEl={anchorEl}
                            onClose={handlePopoverClose}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                            PaperProps={{
                              sx: {
                                bgcolor: '#1e293b',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.1)'
                              }
                            }}
                          >
                            <Box sx={{ p: 1 }}>
                              <MenuItem onClick={() => {
                                handlePopoverClose();
                                navigate(`/poll/${poll.id}/view`);
                              }}>
                                <RemoveRedEye sx={{ mr: 1, fontSize: 20 }} /> View Details
                              </MenuItem>
                              <MenuItem sx={{ color: '#ff4444' }} onClick={() => handleDeletePoll(poll.id)}>
                                <DeleteOutline sx={{ mr: 1, fontSize: 20 }} /> Delete Poll
                              </MenuItem>
                            </Box>
                          </Popover>
                        </>
                      }
                      title={poll.username}
                      subheader={moment(poll.postedDate).fromNow()}
                      subheaderTypographyProps={{ sx: { color: 'rgba(255,255,255,0.6)' } }}
                      titleTypographyProps={{ sx: { color: 'white', fontWeight: 600 } }}
                    />
                    <CardContent sx={{ mb: 0, pt: 0 }}>
                      <Typography
                        variant='body1'
                        color='white'
                        sx={{ cursor: 'pointer', mb: 2, fontWeight: 500 }}
                        onClick={() => navigate(`/poll/${poll.id}/view`)}>
                        {poll.question}
                      </Typography>
                      {poll.optionsDTOS?.map(option => (
                        <Paper
                          elevation={0}
                          key={option.id}
                          onClick={() => !poll.voted && !poll.isExpired && handleAddVote(poll.id, option.id)}
                          sx={{
                            p: 1.5,
                            width: '100%',
                            mt: 1,
                            cursor: (poll.voted || poll.isExpired) ? 'default' : 'pointer',
                            bgcolor: option.userVotedThisOption ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            border: option.userVotedThisOption ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                            color: 'white',
                            transition: 'all 0.2s ease',
                            '&:hover': (poll.voted || poll.isExpired) ? {} : {
                              bgcolor: 'rgba(255, 255, 255, 0.1)',
                              transform: 'translateX(4px)'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">{option.title}</Typography>
                            {poll.voted && (
                              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                {Math.round((option.voteCount / (poll.totalVoteCount || 1)) * 100)}%
                              </Typography>
                            )}
                          </Box>
                        </Paper>
                      ))}
                    </CardContent>
                    <CardActions disableSpacing sx={{ p: 2, justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <Typography variant='caption' sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        Total Votes: <strong>{poll.totalVoteCount}</strong>
                      </Typography>
                      <Typography variant='caption' sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        {poll.isExpired ? 'Expired' : `Expires: ${moment(poll.expiredAt).fromNow()}`}
                      </Typography>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )
          }
        </Grid>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default ViewMyPolls

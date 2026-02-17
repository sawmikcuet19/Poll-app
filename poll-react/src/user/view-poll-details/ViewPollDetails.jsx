import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  Grid,
  LinearProgress,
  TextField,
  Typography,
  Avatar,
  Button,
  Paper,
  Backdrop,
  CircularProgress,
  IconButton
} from '@mui/material';
import { CheckCircleOutline, Comment, Favorite, FavoriteBorder } from '@mui/icons-material';
import { blue } from '@mui/material/colors';
import moment from 'moment';
import { getPollById, giveLikeToPoll, postCommentOnPoll, postVoteOnPole } from '../../services/poll/poll';

const ViewPollDetails = () => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentsCount, setCommentsCount] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPollById(id);
      if (response.status === 200) {
        setPoll(response.data.pollDTO);
        setLikesCount(response.data.likesCount);
        setCommentsCount(response.data.commentsCount);
        setComments(response.data.commentDTOS || []);
      }
    } catch (error) {
      enqueueSnackbar('Error while fetching poll details.', { variant: 'error', autoHideDuration: 5000 });
    } finally {
      setLoading(false);
    }
  }, [id, enqueueSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddVote = async (pollId, optionId) => {
    setLoading(true);
    try {
      const obj = {
        optionId: optionId,
        pollId: pollId
      }
      const response = await postVoteOnPole(obj);
      if (response.status === 200) {
        enqueueSnackbar(`Vote cast successfully`, { variant: 'success', autoHideDuration: 5000 });
        fetchData();
      }
    } catch (error) {
      enqueueSnackbar(`Error while posting the vote`, { variant: 'error', autoHideDuration: 5000 });
    } finally {
      setLoading(false);
    }
  }

  const handleCommentSubmit = async () => {
    setLoading(true);
    try {
      const obj = {
        pollId: id,
        content: newComment
      }
      const response = await postCommentOnPoll(obj);
      if (response.status === 200) {
        setNewComment('');
        fetchData();
        enqueueSnackbar('Comment added!', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar(`Error while posting comment`, { variant: 'error', autoHideDuration: 5000 });
    } finally {
      setLoading(false);
    }
  }

  const handleLikeClick = async () => {
    try {
      const response = await giveLikeToPoll(id);
      if (response.status === 200) {
        fetchData();
      }
    } catch (error) {
      enqueueSnackbar(`Error while liking`, { variant: 'error', autoHideDuration: 5000 });
    }
  }

  return (
    <>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3} direction="column" alignItems="center">
          {!poll && !loading ? (
            <Box sx={{ mt: 10, textAlign: 'center' }}>
              <Typography variant='h5' gutterBottom>Poll not found</Typography>
              <Button variant='contained' onClick={() => navigate('/dashboard')}>Go Back</Button>
            </Box>
          ) : poll && (
            <Grid item xs={12} sm={8} sx={{ width: 500, maxWidth: '100%' }}>
              <Card className="premium-card" sx={{ background: 'rgba(30, 41, 59, 0.7) !important' }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: blue[500] }}>
                      {poll.username?.charAt(0)}
                    </Avatar>
                  }
                  title={poll.username}
                  subheader={moment(poll.postedDate).fromNow()}
                  titleTypographyProps={{ color: 'white' }}
                  subheaderTypographyProps={{ color: 'rgba(255,255,255,0.6)' }}
                />
                <CardContent sx={{ pt: 0 }}>
                  <Typography variant='h6' sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    {poll.question}
                  </Typography>

                  {poll.voted || poll.expired ? (
                    poll.optionsDTOS?.map(option => {
                      const percentage = poll.totalVoteCount > 0
                        ? Math.round((option.voteCount / poll.totalVoteCount) * 100)
                        : 0;
                      return (
                        <Box key={option.id} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" color="white">{option.title}</Typography>
                              {option.userVotedThisOption && <CheckCircleOutline sx={{ color: '#4caf50', fontSize: 18 }} />}
                            </Box>
                            <Typography variant="body2" color="white">{percentage}%</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              bgcolor: 'rgba(255,255,255,0.1)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: option.userVotedThisOption ? '#6366f1' : 'rgba(255,255,255,0.5)'
                              }
                            }}
                          />
                        </Box>
                      );
                    })
                  ) : (
                    poll.optionsDTOS?.map(option => (
                      <Paper
                        key={option.id}
                        elevation={0}
                        onClick={() => handleAddVote(poll.id, option.id)}
                        sx={{
                          p: 2,
                          mb: 1.5,
                          cursor: 'pointer',
                          bgcolor: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'white',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.1)',
                            borderColor: '#6366f1'
                          }
                        }}
                      >
                        {option.title}
                      </Paper>
                    ))
                  )}
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between', opacity: 0.7 }}>
                  <Typography variant='caption' color="white">
                    Total {poll.totalVoteCount} votes
                  </Typography>
                  <Typography variant='caption' color="white">
                    {poll.expired ? 'Expired' : `Expires ${moment(poll.expiredAt).fromNow()}`}
                  </Typography>
                </CardActions>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                <Box sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, color: 'white' }}>
                      <IconButton onClick={handleLikeClick} size="small" sx={{ color: poll.isLiked ? '#ef4444' : 'rgba(255,255,255,0.6)' }}>
                        {poll.isLiked ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                      <Typography variant="body2">{likesCount}</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, color: 'white', opacity: 0.7 }}>
                      <Comment size="small" />
                      <Typography variant="body2">{commentsCount}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Card>

              <Box sx={{ mt: 4, width: '100%' }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                  Comments ({commentsCount})
                </Typography>

                <Box sx={{ background: 'rgba(255,255,255,0.05)', borderRadius: 4, p: 2, mb: 3 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': { color: 'white' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                      variant="contained"
                      className="glass-button"
                      disabled={!newComment.trim() || loading}
                      onClick={handleCommentSubmit}
                    >
                      Post
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {comments.map((comment) => (
                    <Paper key={comment.id} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'white' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#6366f1' }}>
                          {comment.username}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.5 }}>
                          {moment(comment.createdAt).fromNow()}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {comment.content}
                      </Typography>
                    </Paper>
                  ))}
                  {comments.length === 0 && (
                    <Typography variant="body2" sx={{ opacity: 0.5, textAlign: 'center', py: 4 }}>
                      No comments yet. Be the first to comment!
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          )}
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

export default ViewPollDetails

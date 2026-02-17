import React, { useEffect, useState } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    Container,
    Avatar,
    useScrollTrigger,
    Slide
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PollIcon from '@mui/icons-material/Poll';
import { isTokenValid, removeToken } from '../../utility/common';

function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

const Header = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    const handleSignOut = () => {
        removeToken();
        setIsUserLoggedIn(false);
        navigate('/login');
    };

    useEffect(() => {
        const isLoggedIn = isTokenValid();
        setIsUserLoggedIn(isLoggedIn);
    }, [location]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <HideOnScroll {...props}>
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        background: 'rgba(15, 23, 42, 0.7)',
                        backdropFilter: 'blur(10px)',
                        color: '#f1f5f9',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}
                >
                    <Container maxWidth="lg">
                        <Toolbar disableGutters>
                            <PollIcon sx={{ display: 'flex', mr: 1, color: 'primary.main', fontSize: 32 }} />
                            <Typography
                                variant="h6"
                                noWrap
                                component={Link}
                                to="/"
                                sx={{
                                    mr: 2,
                                    display: 'flex',
                                    fontFamily: 'Outfit',
                                    fontWeight: 700,
                                    letterSpacing: '.1rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                    flexGrow: 1
                                }}
                            >
                                VOTEWISE
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {isUserLoggedIn ? (
                                    <>
                                        <Button
                                            component={Link}
                                            to="/dashboard"
                                            sx={{ fontWeight: 600, color: 'inherit' }}
                                        >
                                            Dashboard
                                        </Button>
                                        <Button
                                            component={Link}
                                            to="/poll/create"
                                            variant="contained"
                                            className="glass-button"
                                            size="small"
                                            sx={{ ml: 1, display: { xs: 'none', sm: 'flex' } }}
                                        >
                                            Create Poll
                                        </Button>
                                        <Button
                                            onClick={handleSignOut}
                                            color="error"
                                            sx={{ fontWeight: 600 }}
                                        >
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            component={Link}
                                            to="/login"
                                            sx={{ fontWeight: 600, color: 'inherit' }}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            component={Link}
                                            to="/register"
                                            variant="contained"
                                            className="glass-button"
                                            size="small"
                                            sx={{ ml: 1 }}
                                        >
                                            Get Started
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>
        </Box>
    );
};

export default Header;
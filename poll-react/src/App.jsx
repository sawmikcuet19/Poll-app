// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import Header from './pages/header/Header'
import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/auth/signup/Signup'
import Login from './pages/auth/login/Login'
import Dashboard from './user/dashboard/Dashboard'
import CreatePoll from './user/create-poll/CreatePoll'
import ViewMyPolls from './user/view-my-polls/ViewMyPolls'
import ViewPollDetails from './user/view-poll-details/ViewPollDetails'
import ProtectedRoute from './utility/ProtectedRoute'

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Routes>
        <Route path='/' element={<Navigate to="/dashboard" />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='/poll/create' element={
          <ProtectedRoute>
            <CreatePoll />
          </ProtectedRoute>
        } />
        <Route path='/my-polls' element={
          <ProtectedRoute>
            <ViewMyPolls />
          </ProtectedRoute>
        } />
        <Route path='/poll/:id/:view' element={
          <ProtectedRoute>
            <ViewPollDetails />
          </ProtectedRoute>
        } />
      </Routes>
    </ThemeProvider>
  )
}

export default App

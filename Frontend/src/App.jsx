import React, { useEffect } from 'react';
import {HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi } from './mocks/mockApi.js';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UploadUsers from './pages/UploadUsers.jsx';
import Members from './pages/Members.jsx';
import CreateRoutine from './pages/CreateRoutine.jsx';
import CreateExercise from './pages/CreateExercise.jsx';
import { useDispatch } from 'react-redux';
import { getAllExercise, getAllRoutine, getMembers } from './serviceFunctions/userRelatedFunc.js';
import { setAllActiveRoutines, setAllExercises, setUsers } from './redux/slices/dataSlice.js';
import TestLanding from './pages/TestLanding.jsx';
import LatestRoutine from './pages/LatestRoutine.jsx';
import WithRoutine from './pages/WithRoutine.jsx';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authApi.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const isAuthenticated = authApi.isAuthenticated();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  const dispatch=useDispatch();
  useEffect(()=>{
    const run=async()=>{
      const allMembers=await getMembers() ;
      dispatch(setUsers(allMembers));
      const allExercises=await getAllExercise();
      dispatch(setAllExercises(allExercises));
      // const allActiveRoutine=await getAllRoutine();
      // dispatch(setAllActiveRoutines(allActiveRoutine));
    }
    run();
  },[])


  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route 
                path="/signup" 
                element={
                  <PublicRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Signup />
                    </motion.div>
                  </PublicRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Login />
                    </motion.div>
                  </PublicRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Dashboard />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/upload-users" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <UploadUsers />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/members" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Members />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-routine" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CreateRoutine />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-exercise" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CreateExercise />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/with-routine" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <WithRoutine />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/latest-routine" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <LatestRoutine />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/test/take-test/*" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TestLanding />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/test/view-test/*" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TestLanding />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />

            </Routes>
          </AnimatePresence>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              className: 'dark:bg-gray-800 dark:text-white',
              style: {
                background: 'var(--toast-bg, #363636)',
                color: 'var(--toast-color, #fff)',
              },
            }}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

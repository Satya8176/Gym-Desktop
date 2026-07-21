import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx'; // used as Setup page
import Dashboard from './pages/Dashboard.jsx';
import UploadUsers from './pages/UploadUsers.jsx';
import Members from './pages/Members.jsx';
import CreateExercise from './pages/CreateExercise.jsx';
import BodyParts from './pages/BodyParts.jsx';
import Equipment from './pages/Equipment.jsx';
import Templates from './pages/Templates.jsx';
import TestLanding from './pages/TestLanding.jsx';
import WithRoutine from './pages/WithRoutine.jsx';
import CreateRoutineHomePage from './pages/CreateRoutineHomePage.jsx';
import { useNavigate } from "react-router-dom";
import { setNavigator } from "./serviceFunctions/navigation.js";

import { useDispatch } from 'react-redux';
import {
  getAllExercise,
  getCountHavingRoutine,
  getMembers
} from './serviceFunctions/userRelatedFunc.js';

import {
  setAllExercises,
  setUsers,
  setAllActiveRoutinesCount,
  setAllBodyPart,
  setAllEquipment
} from './redux/slices/dataSlice.js';

import {
  getAllBodyParts,
  getAllEquipment
} from './serviceFunctions/templateFunctions.js';

import {
  checkOwnerExists,
  isAuthenticated
} from './serviceFunctions/adminFun.js';


// 🔐 Protected Route
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};


// 🚀 Start Route Logic
const StartRoute = () => {
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await checkOwnerExists();
        setExists(res);
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return exists ? <Navigate to="/login" /> : <Navigate to="/setup" />;
};

function NavigationSetter() {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);
  return null; // renders nothing
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const run = async () => {
      try {
        const members = await getMembers();
        dispatch(setUsers(members));

        const exercises = await getAllExercise();
        dispatch(setAllExercises(exercises));

        const routineCount = await getCountHavingRoutine();
        if (routineCount) dispatch(setAllActiveRoutinesCount(routineCount));

        const bodyParts = await getAllBodyParts();
        dispatch(setAllBodyPart(bodyParts.map(b => b.name)));

        const equipment = await getAllEquipment();
        dispatch(setAllEquipment(equipment.map(e => e.name)));

      } catch (err) {
        console.log("Init error:", err);
      }
    };

    run();
  }, [dispatch]);


  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">

          <AnimatePresence mode="wait">
            <NavigationSetter />
            <Routes>

              {/* ENTRY */}
              <Route path="/" element={<StartRoute />} />

              {/* SETUP (FIRST TIME ONLY) */}
              <Route
                path="/setup"
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Signup />
                  </motion.div>
                }
              />

              {/* LOGIN */}
              <Route
                path="/login"
                element={
                  isAuthenticated()
                    ? <Navigate to="/dashboard" />
                    : <Login />
                }
              />

              {/* DASHBOARD */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
              <Route path="/upload-users" element={<ProtectedRoute><UploadUsers /></ProtectedRoute>} />
              <Route path="/create-routine" element={<ProtectedRoute><CreateRoutineHomePage /></ProtectedRoute>} />
              <Route path="/create-exercise" element={<ProtectedRoute><CreateExercise /></ProtectedRoute>} />
              <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
              <Route path="/body-parts" element={<ProtectedRoute><BodyParts /></ProtectedRoute>} />
              <Route path="/equipment" element={<ProtectedRoute><Equipment /></ProtectedRoute>} />
              <Route path="/test/take-test/*" element={<ProtectedRoute><TestLanding /></ProtectedRoute>} />
              <Route path="/test/view-test/*" element={<ProtectedRoute><TestLanding /></ProtectedRoute>} />
              <Route path="/with-routine" element={<ProtectedRoute><WithRoutine /></ProtectedRoute>} />

            </Routes>
          </AnimatePresence>

          <Toaster position="top-right" />

        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
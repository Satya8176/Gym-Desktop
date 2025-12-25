import toast from 'react-hot-toast';
import { mockMembers, mockExercises, mockRoutines } from './data.js';

// Mock API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage helpers
const getFromStorage = (key, defaultValue = []) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize local storage with mock data
const initializeMockData = () => {
  if (!localStorage.getItem('gym_members')) {
    saveToStorage('gym_members', mockMembers);
  }
  if (!localStorage.getItem('gym_exercises')) {
    saveToStorage('gym_exercises', mockExercises);
  }
  if (!localStorage.getItem('gym_routines')) {
    saveToStorage('gym_routines', mockRoutines);
  }
};

// Initialize data on app load
initializeMockData();

// Auth API
export const authApi = {
  signup: async (data) => {
    await delay();
    const token = `fake-token-${Date.now()}`;
    localStorage.setItem('gym_token', token);
    localStorage.setItem('gym_owner', JSON.stringify({
      name: data.name,
      email: data.email
    }));
    toast.success('Account created successfully!');
    return { success: true, token };
  },

  login: async (credentials) => {
    await delay();
    if (credentials.email && credentials.password) {
      const token = `fake-token-${Date.now()}`;
      localStorage.setItem('gym_token', token);
      localStorage.setItem('gym_owner', JSON.stringify({
        name: 'Gym Owner',
        email: credentials.email
      }));
      toast.success('Logged in successfully!');
      return { success: true, token };
    }
    throw new Error('Invalid credentials');
  },

  logout: () => {
    localStorage.removeItem('gym_token');
    localStorage.removeItem('gym_owner');
    toast.success('Logged out successfully!');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('gym_token');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('gym_owner');
    return user ? JSON.parse(user) : null;
  }
};

// Members API
export const membersApi = {
  getAll: async () => {
    await delay(300);
    return getFromStorage('gym_members', mockMembers);
  },

  update: async (id, updatedData) => {
    await delay();
    const members = getFromStorage('gym_members', mockMembers);
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index] = { ...members[index], ...updatedData };
      saveToStorage('gym_members', members);
      toast.success('Member updated successfully!');
      return members[index];
    }
    throw new Error('Member not found');
  },

  uploadCSV: async (file) => {
    await delay(1000);
    toast.success(`Successfully uploaded ${file.name}!`);
    return { success: true, message: 'CSV uploaded successfully' };
  }
};

// Exercises API
export const exercisesApi = {
  getAll: async () => {
    await delay(200);
    return getFromStorage('gym_exercises', mockExercises);
  },

  create: async (exerciseData) => {
    await delay();
    const exercises = getFromStorage('gym_exercises', mockExercises);
    const newExercise = {
      id: `e${Date.now()}`,
      ...exerciseData
    };
    exercises.push(newExercise);
    saveToStorage('gym_exercises', exercises);
    toast.success('Exercise created successfully!');
    return newExercise;
  }
};

// Routines API
export const routinesApi = {
  getAll: async () => {
    await delay(300);
    return getFromStorage('gym_routines', mockRoutines);
  },

  create: async (routineData) => {
    await delay();
    const routines = getFromStorage('gym_routines', mockRoutines);
    const newRoutine = {
      id: `r${Date.now()}`,
      ...routineData
    };
    routines.push(newRoutine);
    saveToStorage('gym_routines', routines);
    toast.success('Routine created successfully!');
    return newRoutine;
  }
};
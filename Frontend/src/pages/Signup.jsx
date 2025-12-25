import React, { useState } from 'react';
import { Form, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../mocks/mockApi.js';
import ThemeToggle from '../components/ThemeToggle.jsx';
import toast from 'react-hot-toast';
import { adminSignUp } from '../serviceFunctions/adminFun.js';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone:''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // const fd=new FormData();
      // fd.append("name",formData.name)
      // fd.append("email",formData.email);
      // fd.append("password",formData.password);
      // fd.append("cnfpassword",formData.confirmPassword);
      // fd.append("phone",formData.phone);
      // const res=await fetch("http://localhost:4000/api/owner/signUp",{
      //   method:"POST",
      //   body:fd
      // })
      // if (!res.ok) {
      //     const errorData = await res.json();
      //     throw new Error(errorData.message);
      //   }
      //   toast.success('User SignUp complete');
        const res=await adminSignUp(formData);
        navigate("/login")
    } catch (error) {
      console.log("Error in SingUp")
      // toast.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-4">
              <motion.div 
                className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-2xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Dumbbell className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </motion.div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Set up your gym management system</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-100 mb-2">
                Enter Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your gym name"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-100 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-100 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your phone"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-100 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 pr-10"
                  placeholder="Enter your password"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 dark:text-gray-100 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-medium py-3 px-4 rounded-xl hover:from-primary-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-gray-700 dark:text-gray-200">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
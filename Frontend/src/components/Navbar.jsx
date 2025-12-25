import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Users, 
  Calendar, 
  Dumbbell, 
  Home,
  LogOut,
  // Dumbbell,
} from 'lucide-react';
import { authApi } from '../mocks/mockApi.js';
import ThemeToggle from './ThemeToggle.jsx';
import { adminLogOut } from '../serviceFunctions/adminFun.js';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authApi.getCurrentUser();
  const [openMenu, setOpenMenu] = useState(null);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    adminLogOut();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/upload-users', icon: Upload, label: 'Upload Users' },
    { path: '/members', icon: Users, label: 'View Members' },
    { path: '/create-routine', icon: Calendar, label: 'Create Routine' },
    { path: '/create-exercise', icon: Dumbbell, label: 'Create Exercise' },
    {
      path: '/routines',
      icon: Calendar,
      label: 'Routines',
      children: [
        { path: '/with-routine', label: 'With Routines', icon: Dumbbell },
        { path: '/latest-routine', label: 'Latest Routine', icon: Dumbbell },
      ],
    },
  ];

  return (
    <motion.nav 
      className="bg-background shadow-sm border-b border-border transition-colors duration-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-[94%] mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex justify-between h-16 w-full">
          <div className="flex items-center">
            <motion.div 
              className="flex-shrink-0 flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Dumbbell className="h-8 w-8 text-primary mr-2" />
              </motion.div>
              <span className="text-xl font-bold text-foreground">
                FitnessPro 
              </span>
            </motion.div>
          </div>

          <div className="hidden md:flex w-[65%] items-center justify-between space-x-[2px] ">
            {navItems.map((item) => {
              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isActive = location.pathname === item.path || (hasChildren && item.children.some(child => location.pathname === child.path));

              if (!hasChildren) {
                return (
                  <motion.div
                    key={item.path}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.path}
                      className={`px-2 py-1.5 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-accent-foreground hover:bg-accent'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => {
                    if (closeTimerRef.current) {
                      clearTimeout(closeTimerRef.current);
                      closeTimerRef.current = null;
                    }
                    setOpenMenu(item.label);
                  }}
                  onMouseLeave={() => {
                    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                    closeTimerRef.current = setTimeout(() => setOpenMenu(null), 150);
                  }}
                  onFocus={() => {
                    if (closeTimerRef.current) {
                      clearTimeout(closeTimerRef.current);
                      closeTimerRef.current = null;
                    }
                    setOpenMenu(item.label);
                  }}
                  onBlur={() => {
                    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
                    closeTimerRef.current = setTimeout(() => setOpenMenu(null), 200);
                  }}
                  tabIndex={0}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                    className={`px-2 py-1.5 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-accent-foreground hover:bg-accent'
                    }`}
                    aria-haspopup="true"
                    aria-expanded={openMenu === item.label}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </motion.button>

                  {openMenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 mt-1 w-48 bg-background border border-border rounded-md shadow-md z-50"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block px-4 py-2 text-sm rounded-md transition-colors duration-150 ${
                            location.pathname === child.path ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                          onClick={() => setOpenMenu(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {/* <div className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{currentUser?.name || 'Gym Owner'}</span>
            </div> */}
            <motion.button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="h-4 w-4" />
              <span className='text-red-500 font-bold'>Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { Moon, Sun, ArrowLeft, Home as HomeIcon, ChevronRight, Search, LayoutDashboard, User } from 'lucide-react';

import { Services } from './pages/Services';
import { Dashboard } from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { Home } from './pages/Home';

const PageHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (['/', '/login', '/register'].includes(location.pathname)) return null; 

  const pathnames = location.pathname.split('/').filter((x) => x);

  const formatName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-[73px] z-40 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-2 font-medium text-sm"
          title="Go Back"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>

        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1 sm:space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <li>
              <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
                <HomeIcon className="w-4 h-4" />
              </Link>
            </li>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;

              return (
                <li key={to} className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  {last ? (
                    <span className="font-medium text-slate-900 dark:text-slate-200" aria-current="page">
                      {formatName(value)}
                    </span>
                  ) : (
                    <Link to={to} className="hover:text-blue-600 dark:hover:text-blue-400">
                      {formatName(value)}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};

const Navbar = ({ toggleTheme, isDark }: any) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Top Nav on Login & Register for cleaner look, optional.
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50 transition-colors">
      <Link to="/" className="font-extrabold text-2xl text-blue-600 dark:text-blue-500 tracking-tight flex items-center gap-2">
        <svg className="w-8 h-8 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        HireWave
      </Link>
      <div className="flex gap-4 md:gap-6 items-center">
        <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <Link to="/services" className="hidden sm:block text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Find Services</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="hidden sm:block text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Dashboard</Link>
            <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button onClick={handleLogout} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors">Logout</button>
          </>
        ) : (
          <>
             <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
             <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Log in</Link>
             <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 font-medium transition-colors shadow-sm">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (['/login', '/register'].includes(location.pathname)) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 px-6 py-3 flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.2)] pb-safe transition-colors">
      <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-blue-600 dark:text-blue-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
        <HomeIcon className="w-5 h-5" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <Link to="/services" className={`flex flex-col items-center gap-1 ${isActive('/services') ? 'text-blue-600 dark:text-blue-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-medium">Search</span>
      </Link>
      {user ? (
        <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${isActive('/dashboard') ? 'text-blue-600 dark:text-blue-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">Dashboard</span>
        </Link>
      ) : (
        <Link to="/login" className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Login</span>
        </Link>
      )}
    </div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors pb-16 md:pb-0`}>
      <Router>
        <Navbar toggleTheme={() => setIsDark(!isDark)} isDark={isDark} />
        <PageHeader />
        {children}
        <BottomNav />
        <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: isDark ? '#1e293b' : '#333', color: '#fff' } }} />
      </Router>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

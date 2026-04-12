import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiUser } from 'react-icons/fi';
import { TfiLock } from 'react-icons/tfi';
import { useAuth } from '../../../context/AuthContext';
import Logo from '../../../assets/images/logo/logo.svg';
import LogoDark from '../../../assets/images/logo/logo-dark.svg';
import LoginImg from '../../../assets/images/LoginImg/login.svg';

const LoginEmployee = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      const data = await login(username, password);
      if (data.role !== 'employee') {
        toast.error('Access denied. Employee credentials required.');
        return;
      }
      toast.success('Login successful!');
      navigate('/employee/dashboard');
    } catch (error) {
      const msg = error.response?.data?.msg || 'Login failed. Please check your credentials.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 dark:from-boxdark dark:via-boxdark-2 dark:to-boxdark flex items-center justify-center p-4">
      <div className="flex w-full max-w-[1200px] rounded-2xl border border-stroke bg-white shadow-2xl dark:border-strokedark dark:bg-boxdark overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="hidden w-1/2 xl:flex flex-col items-center justify-center bg-gradient-to-br from-[#0FADCF] to-[#0FADCF]/80 p-12"
        >
          <div className="text-center">
            <span className="mb-6 inline-block">
              <img className="w-40" src={Logo} alt="Logo" />
            </span>
            <h3 className="mb-3 text-2xl font-bold text-white">
              Welcome Back!
            </h3>
            <p className="text-white/80 text-lg mb-8">
              Sign in to view your salary and attendance information.
            </p>
            <motion.img
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mx-auto w-72"
              src={LoginImg}
              alt="Login illustration"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full xl:w-1/2 flex items-center"
        >
          <div className="w-full p-8 sm:p-12 xl:p-16">
            <div className="xl:hidden mb-8 flex justify-center">
              <img className="w-28 dark:hidden" src={LogoDark} alt="Logo" />
              <img className="w-28 hidden dark:block" src={Logo} alt="Logo" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="mb-2 text-3xl font-bold text-black dark:text-white">
                Employee Login
              </h2>
              <p className="mb-8 text-body dark:text-bodydark">
                Enter your credentials to access your dashboard.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none transition focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <FiUser className="absolute right-4 top-4.5 text-xl text-body dark:text-bodydark" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none transition focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <TfiLock className="absolute right-4 top-4.5 text-xl text-body dark:text-bodydark" />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full cursor-pointer rounded-lg bg-primary p-4 text-white font-medium transition hover:bg-opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </motion.button>
              </form>

              <p className="mt-6 text-center text-body dark:text-bodydark">
                Are you an admin?{' '}
                <Link to="/admin/login" className="text-primary font-medium hover:underline">
                  Admin Login
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginEmployee;

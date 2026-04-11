import React, { useState, useEffect } from 'react';
import { Routes } from './config';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.remove();
    }
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-boxdark">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes />
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;

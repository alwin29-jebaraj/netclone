import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginScreen({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      setError('Please enter a valid email and password.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 4) {
      setError('Your password must contain between 4 and 60 characters.');
      return false;
    }
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      onAuthSuccess(data.user, data.profiles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-black font-sans text-white overflow-hidden select-none">
      {/* Background radial gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-t from-black via-transparent to-black"></div>
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-700 via-transparent to-black"></div>
      </div>

      {/* Top Header */}
      <header className="relative p-6 md:px-16 md:py-8 flex justify-between items-center z-20">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#E50914] font-display">
          NETCLONE
        </h1>
      </header>

      {/* Login Card */}
      <div className="relative flex-grow flex items-center justify-center px-4 py-12 z-20">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[450px] bg-black bg-opacity-75 p-10 md:p-16 rounded-lg shadow-2xl border border-neutral-800/60 backdrop-blur-xs"
        >
          <h2 className="text-3xl font-bold mb-8 text-white">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h2>

          {error && (
            <div className="bg-[#e87c03] text-white text-[14px] p-3 rounded mb-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-[#2a2a2a] border-none rounded p-4 text-white placeholder-neutral-400 focus:ring-2 focus:ring-neutral-500 outline-none transition-all text-[15px]"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-[#2a2a2a] border-none rounded p-4 pr-12 text-white placeholder-neutral-400 focus:ring-2 focus:ring-neutral-500 outline-none transition-all text-[15px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden"
              >
                <div className="relative pt-1">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full bg-[#2a2a2a] border-none rounded p-4 text-white placeholder-neutral-400 focus:ring-2 focus:ring-neutral-500 outline-none transition-all text-[15px]"
                  />
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded transition-colors mt-6 flex items-center justify-center gap-2 cursor-pointer text-[15px]"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                isSignUp ? 'Sign Up' : 'Sign In'
              )}
            </button>
          </form>

          <div className="flex justify-between items-center text-xs text-neutral-400 mt-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-neutral-700 border-none text-[#E50914] focus:ring-0 w-4 h-4 cursor-pointer"
              />
              Remember me
            </label>
            <a href="#" className="hover:underline">Need help?</a>
          </div>

          <div className="mt-10 space-y-4">
            <div className="text-neutral-400 text-sm">
              <span>
                {isSignUp ? 'Already have an account? ' : 'New to NetClone? '}
              </span>
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-white hover:underline font-semibold cursor-pointer"
              >
                {isSignUp ? 'Sign In now.' : 'Sign Up now.'}
              </button>
            </div>
            <div className="text-xs text-neutral-500 leading-tight">
              This page is protected by Google reCAPTCHA to ensure you're not a bot. Learn more.
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative bg-black bg-opacity-80 border-t border-neutral-900 py-8 px-6 md:px-16 z-20 text-neutral-400 text-sm">
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="hover:underline cursor-pointer">Questions? Contact us.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <a href="#" className="hover:underline">FAQ</a>
            <a href="#" className="hover:underline">Help Center</a>
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Cookie Preferences</a>
            <a href="#" className="hover:underline">Corporate Information</a>
          </div>
          <p className="text-[11px] text-neutral-600">NetClone Authentication Project - Made for demo purposes.</p>
        </div>
      </footer>
    </div>
  );
}

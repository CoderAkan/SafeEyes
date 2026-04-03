import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      // error is set in the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-bg-secondary relative overflow-hidden">
      <div className="w-full max-w-[440px] bg-bg-card border border-border-default rounded-3xl p-12 shadow-sm relative z-10 animate-fade-in-up">
        
        <div className="flex items-center gap-3.5 mb-8">
          <div className="w-12 h-12 bg-accent-primary rounded-xl flex items-center justify-center text-2xl text-white">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold mb-1 text-text-primary">SafeEyes</h1>
            <p className="text-text-secondary text-[0.925rem]">AI Safety Monitoring</p>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold mb-1 text-text-primary">Welcome back</h1>
        <p className="text-text-secondary text-[0.925rem] mb-8">Sign in to your SafeEyes dashboard</p>

        {error && (
          <div className="bg-danger/20 border border-danger/30 text-danger px-4 py-3 rounded-md text-[0.85rem] mb-5 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="block text-[0.8rem] font-semibold text-text-secondary mb-2 uppercase tracking-wide">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError(); }}
              required
              autoComplete="email"
              className="w-full px-4 py-3 bg-bg-card border border-border-default rounded-md text-text-primary text-[0.95rem] transition-all duration-150 outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary placeholder:text-text-muted"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block text-[0.8rem] font-semibold text-text-secondary mb-2 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-11 bg-bg-card border border-border-default rounded-md text-text-primary text-[0.95rem] transition-all duration-150 outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary placeholder:text-text-muted"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-text-muted cursor-pointer p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-accent-primary shadow-sm transition-all duration-200 cursor-pointer hover:bg-accent-secondary disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 text-text-secondary text-[0.9rem]">
          Don't have an account? <Link to="/signup" className="font-semibold text-accent-primary hover:text-accent-cyan transition-colors">Create one</Link>
        </div>
      </div>
    </div>
  );
}

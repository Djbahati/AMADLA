import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Zap, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', 'bg-energy-red', 'bg-energy-amber', 'bg-energy-blue', 'bg-energy-green'];

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [validErr, setValidErr] = useState('');

  const onChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setValidErr('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword)
      return setValidErr('Please fill in all fields');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setValidErr('Enter a valid email address');
    if (form.password.length < 8)
      return setValidErr('Password must be at least 8 characters');
    if (form.password !== form.confirmPassword)
      return setValidErr('Passwords do not match');
    const result = await register(form.name, form.email, form.password);
    if (result.success) navigate('/dashboard');
  };

  const strength = passwordStrength(form.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-3">
              <Zap className="h-7 w-7 text-accent" />
            </div>
            <h1 className="font-heading text-2xl font-bold">Create account</h1>
            <p className="text-muted-foreground text-sm mt-1">Join Amadla Energy platform</p>
          </div>

          {(error || validErr) && (
            <div className="mb-5 p-3 bg-destructive/10 text-destructive rounded-xl text-sm border border-destructive/20">
              {error || validErr}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <input name="name" type="text" value={form.name} onChange={onChange}
                placeholder="John Doe" disabled={isLoading}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all disabled:opacity-50" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input name="email" type="email" value={form.email} onChange={onChange}
                placeholder="you@example.com" disabled={isLoading}
                className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all disabled:opacity-50" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={onChange}
                  placeholder="Min. 8 characters" disabled={isLoading}
                  className="w-full px-4 py-2.5 pr-11 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all disabled:opacity-50" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor[strength] : 'bg-border'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{strengthLabel[strength]}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
              <input name="confirmPassword" type={showPw ? 'text' : 'password'} value={form.confirmPassword} onChange={onChange}
                placeholder="••••••••" disabled={isLoading}
                className={`w-full px-4 py-2.5 bg-secondary border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all disabled:opacity-50 ${
                  form.confirmPassword && form.confirmPassword !== form.password ? 'border-destructive' : 'border-border'
                }`} />
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-accent-foreground font-semibold rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              ) : (
                <><UserPlus className="h-4 w-4" /> Create Account</>
              )}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-border text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline font-medium">Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

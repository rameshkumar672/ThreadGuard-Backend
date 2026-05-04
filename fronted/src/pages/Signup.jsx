import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldPlus, User, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match. Integrity check failed.');
      return;
    }
    const success = await register(formData);
    if (success) navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cyber-900 flex items-center justify-center p-4 bg-grid-anim relative overflow-hidden">
      <div className="absolute top-1/2 left-3/4 w-[500px] h-[500px] bg-cyber-secondary/20 blur-[120px] rounded-full -translate-y-1/2"></div>
      
      <div className="w-full max-w-md p-8 cyber-card backdrop-blur-sm bg-cyber-800/80 border border-cyber-secondary/50 relative z-10 shadow-[0_0_30px_rgba(112,0,255,0.15)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-secondary via-cyber-primary to-cyber-secondary animate-pulse"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-cyber-900 border border-cyber-secondary/50 rounded-full flex items-center justify-center shadow-[0_0_15px_#7000FF] mb-4 relative">
             <ShieldPlus className="text-cyber-secondary w-8 h-8" />
             <div className="absolute inset-0 border-2 border-cyber-secondary/30 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          </div>
          <h2 className="text-3xl font-mono text-white tracking-widest font-bold">NEW<span className="text-cyber-secondary">_AGENT</span></h2>
          <p className="text-gray-400 mt-2 font-mono text-sm uppercase tracking-wide">Register for clearance</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-cyber-secondary font-mono text-xs uppercase tracking-wider block">CODENAME / FULL NAME</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-secondary/70" />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Agent Name"
                className="w-full bg-cyber-900 border border-cyber-600 rounded px-10 py-2.5 text-white focus:outline-none focus:border-cyber-secondary focus:ring-1 focus:ring-cyber-secondary transition-all duration-300 font-mono text-sm shadow-inner"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-cyber-secondary font-mono text-xs uppercase tracking-wider block">SECURE_COMMS / EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-secondary/70" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="agent@threatguard.net"
                className="w-full bg-cyber-900 border border-cyber-600 rounded px-10 py-2.5 text-white focus:outline-none focus:border-cyber-secondary focus:ring-1 focus:ring-cyber-secondary transition-all duration-300 font-mono text-sm shadow-inner"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-cyber-secondary font-mono text-xs uppercase tracking-wider block">CIPHER_KEY / PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-secondary/70" />
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="********"
                className="w-full bg-cyber-900 border border-cyber-600 rounded px-10 py-2.5 text-white focus:outline-none focus:border-cyber-secondary focus:ring-1 focus:ring-cyber-secondary transition-all duration-300 font-mono text-sm shadow-inner"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-cyber-secondary font-mono text-xs uppercase tracking-wider block">VERIFY_CIPHER / CONFIRM_PWD</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-secondary/70" />
              <input 
                type="password" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="********"
                className="w-full bg-cyber-900 border border-cyber-600 rounded px-10 py-2.5 text-white focus:outline-none focus:border-cyber-secondary focus:ring-1 focus:ring-cyber-secondary transition-all duration-300 font-mono text-sm shadow-inner"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-cyber-secondary/10 border border-cyber-secondary text-cyber-secondary py-3 rounded font-mono font-bold uppercase tracking-wider relative overflow-hidden group hover:bg-cyber-secondary hover:text-white transition-all duration-300 mt-6 shadow-[0_0_15px_rgba(112,0,255,0.2)] hover:shadow-[0_0_25px_#7000FF]"
          >
            <span className="relative z-10 flex justify-center items-center gap-2">
              <ShieldPlus size={18} /> GENERATE_CREDENTIALS
            </span>
          </button>
        </form>

        <div className="mt-6 text-center text-sm font-mono border-t border-cyber-600 pt-4">
          <span className="text-gray-400">EXISTING_AGENT? </span>
          <Link to="/login" className="text-cyber-secondary hover:text-white hover:underline transition-all">
            AUTH_TERMINAL
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

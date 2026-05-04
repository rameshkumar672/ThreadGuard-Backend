import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, Fingerprint } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-cyber-900 flex items-center justify-center p-4 bg-grid-anim relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-primary/20 blur-[100px] rounded-full"></div>
      
      <div className="w-full max-w-md p-8 cyber-card backdrop-blur-sm bg-cyber-800/80 border border-cyber-primary/50 relative z-10 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-primary via-cyber-success to-cyber-primary animate-pulse"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-cyber-900 border border-cyber-primary/50 rounded-full flex items-center justify-center shadow-[0_0_15px_#00F0FF] mb-4 relative">
             <Fingerprint className="text-cyber-primary w-8 h-8 animate-pulse" />
             <div className="absolute inset-0 border-2 border-cyber-primary/30 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-3xl font-mono text-white tracking-widest font-bold">AUTH<span className="text-cyber-primary">_REQ</span></h2>
          <p className="text-gray-400 mt-2 font-mono text-sm uppercase tracking-wide">Enter security credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-cyber-primary font-mono text-xs uppercase tracking-wider block">ID_TOKEN / EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-primary/70" />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Agent Email"
                className="w-full bg-cyber-900 border border-cyber-600 rounded px-10 py-3 text-white focus:outline-none focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary transition-all duration-300 font-mono text-sm shadow-inner"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-cyber-primary font-mono text-xs uppercase tracking-wider block">PASS_KEY / PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-primary/70" />
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="********"
                className="w-full bg-cyber-900 border border-cyber-600 rounded px-10 py-3 text-white focus:outline-none focus:border-cyber-primary focus:ring-1 focus:ring-cyber-primary transition-all duration-300 font-mono text-sm shadow-inner"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-cyber-primary/10 border border-cyber-primary text-cyber-primary py-3 rounded font-mono font-bold uppercase tracking-wider relative overflow-hidden group hover:bg-cyber-primary hover:text-cyber-900 transition-all duration-300 mt-4 shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_#00F0FF]"
          >
            <span className="relative z-10 flex justify-center items-center gap-2">
              <Shield size={18} /> INITIATE_LOGIN
            </span>
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-mono border-t border-cyber-600 pt-4">
          <span className="text-gray-400">NEW_AGENT? </span>
          <Link to="/signup" className="text-cyber-primary hover:text-cyber-success hover:underline transition-all">
            REQUEST_ACCESS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

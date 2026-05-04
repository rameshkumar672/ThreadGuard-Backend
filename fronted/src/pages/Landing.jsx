import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Globe, Zap, Cpu, Activity, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => (
  <nav className="border-b border-cyber-primary/20 bg-cyber-900/80 backdrop-blur-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Shield className="text-cyber-primary w-10 h-10 glow-pulse" />
            <div className="absolute inset-0 bg-cyber-primary opacity-20 blur-lg rounded-full"></div>
          </div>
          <span className="text-2xl font-bold tracking-widest text-white">THREAT<span className="text-cyber-primary">GUARD</span></span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#home" className="text-gray-300 hover:text-cyber-primary transition-colors font-mono text-sm uppercase">Home</a>
          <a href="#features" className="text-gray-300 hover:text-cyber-primary transition-colors font-mono text-sm uppercase">Features</a>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/login" className="cyber-btn-secondary text-sm">LOGIN_AGENT</Link>
          <Link to="/signup" className="cyber-btn-primary text-sm shadow-[0_0_10px_#00F0FF]">INIT_SIGNUP</Link>
        </div>
      </div>
    </div>
  </nav>
);

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const features = [
    { icon: Activity, title: 'Real-Time Monitoring', desc: 'Continuous surveillance of user login activities to detect anomalous behavior instantly.' },
    { icon: Globe, title: 'GeoIP Protection', desc: 'Block authentication attempts from known malicious IP networks or restricted zones.' },
    { icon: Lock, title: 'Brute Force Defense', desc: 'Intelligent rate limiting and automated locking mechanisms against credential stuffing.' },
    { icon: Zap, title: 'Automated Response', desc: 'Trigger immediate countermeasures without human intervention during suspected breaches.' },
    { icon: Cpu, title: 'AI-Powered Analysis', desc: 'Machine learning algorithms calculate real-time threat scores to flag risky sessions.' },
    { icon: Shield, title: 'API & Web Hooks', desc: 'Integrate your existing infrastructure safely with our zero-trust endpoint protection.' },
  ];

  return (
    <div className="min-h-screen bg-cyber-900 flex flex-col font-sans text-gray-300 scroll-smooth">
      <Navbar />

      <main className="flex-grow">
        <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-grid-anim">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-primary/10 blur-[150px] rounded-full point-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
              <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-cyber-800/50 border border-cyber-primary/30 rounded-full px-4 py-1.5 mb-8">
                <span className="flex w-2 h-2 rounded-full bg-cyber-primary animate-pulse"></span>
                <span className="text-cyber-primary font-mono text-xs uppercase tracking-wide">System Status: Secure</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                AI Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-cyber-secondary filter drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">Login Protection</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto mb-10">
                ThreatGuard monitors, detects, and neutrallizes login attacks in milliseconds. Protect your application infrastructure with military-grade intelligent authentication defenses.
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex justify-center flex-wrap gap-6">
                <Link to="/signup" className="cyber-btn-primary text-lg px-8 py-3 flex items-center shadow-[0_0_20px_#00F0FF]">
                  DEPLOY DEFENSES <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link to="/login" className="cyber-btn-secondary text-lg px-8 py-3 text-white border-cyber-500 hover:border-cyber-primary">
                  ACCESS CONSOLE
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-24 bg-cyber-800/30 border-t border-cyber-600 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-widest font-mono">
                <span className="text-cyber-primary mr-2">&lt;</span>
                Threat Vector Defenses
                <span className="text-cyber-primary ml-2">/&gt;</span>
              </h2>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">Comprehensive security infrastructure deployed instantly at the network edge.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="cyber-card p-8 group hover:-translate-y-2 hover:border-cyber-primary"
                  >
                    <div className="w-14 h-14 bg-cyber-900 border border-cyber-600 rounded-lg flex items-center justify-center mb-6 group-hover:border-cyber-primary transition-colors">
                      <Icon className="text-cyber-primary w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyber-primary transition-colors">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-cyber-900 border-t border-cyber-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="text-cyber-primary w-6 h-6" />
            <span className="text-xl font-bold tracking-widest text-white">THREAT<span className="text-cyber-primary">GUARD</span></span>
          </div>
          <p className="text-gray-500 font-mono text-sm uppercase">© 2026 ThreatGuard System. All Systems Secure.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

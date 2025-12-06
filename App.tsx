import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TOOLS, ToolDef } from './constants';
import CyberCard from './components/CyberCard';
import ToolWorkspace from './components/ToolWorkspace';
import MatrixRain from './components/MatrixRain';
import { Shield, Cpu, Zap, Menu, Home, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolDef | null>(null);

  return (
    <div className="relative min-h-screen bg-black text-gray-200 selection:bg-green-500 selection:text-black overflow-x-hidden">
      <MatrixRain />
      
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-green-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
             className="flex items-center cursor-pointer group"
             onClick={() => setActiveTool(null)}
          >
             <div className="w-10 h-10 bg-green-900/20 rounded-lg flex items-center justify-center border border-green-500/50 mr-3 group-hover:shadow-[0_0_15px_#22c55e] transition-shadow">
               <Shield className="w-6 h-6 text-green-500" />
             </div>
             <h1 className="text-xl md:text-2xl font-bold text-white cyber-font tracking-tighter">
               CYBER<span className="text-green-500">PDF</span>
             </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
             <div className="flex items-center text-xs font-mono text-green-500/60">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                SYSTEM_ONLINE
             </div>
             <button className="p-2 hover:bg-green-500/10 rounded-lg transition-colors">
               <Settings className="w-5 h-5 text-gray-400 hover:text-green-400" />
             </button>
          </div>

          <button className="md:hidden p-2 text-green-500">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 pt-24 pb-20 container mx-auto px-4">
        <AnimatePresence mode="wait">
          {!activeTool ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
               {/* Hero Section */}
               <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
                 <div className="inline-block px-4 py-1 rounded-full bg-green-900/30 border border-green-500/30 text-green-400 text-xs font-mono tracking-widest mb-4">
                   V.2.0.45 // SECURE PROTOCOL
                 </div>
                 <h2 className="text-4xl md:text-6xl font-bold text-white cyber-font leading-tight">
                   NEXT GEN <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 animate-pulse">
                     PDF ARSENAL
                   </span>
                 </h2>
                 <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
                   Advanced manipulation tools for digital documents. Secure, client-side processing with zero server uploads.
                 </p>
               </div>

               {/* Stats / Features Strip */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 border-y border-green-500/10 py-8">
                  <div className="flex items-center justify-center gap-4 text-gray-300">
                     <Cpu className="w-6 h-6 text-green-500" />
                     <div>
                       <div className="text-xl font-bold cyber-font">Local Core</div>
                       <div className="text-xs text-gray-500 font-mono">100% Client-Side Processing</div>
                     </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-gray-300 border-l border-r border-green-500/10">
                     <Shield className="w-6 h-6 text-green-500" />
                     <div>
                       <div className="text-xl font-bold cyber-font">Encrypted</div>
                       <div className="text-xs text-gray-500 font-mono">Military Grade Privacy</div>
                     </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-gray-300">
                     <Zap className="w-6 h-6 text-green-500" />
                     <div>
                       <div className="text-xl font-bold cyber-font">Instant</div>
                       <div className="text-xs text-gray-500 font-mono">Zero Latency Operations</div>
                     </div>
                  </div>
               </div>

               {/* Tools Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {TOOLS.map((tool, index) => (
                   <CyberCard 
                     key={tool.id} 
                     tool={tool} 
                     index={index} 
                     onClick={() => setActiveTool(tool)}
                   />
                 ))}
               </div>
            </motion.div>
          ) : (
            <ToolWorkspace 
              key="workspace" 
              tool={activeTool} 
              onBack={() => setActiveTool(null)} 
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Copyright */}
      <footer className="relative z-10 py-8 text-center border-t border-green-500/10 bg-black/50">
        <p className="text-gray-600 text-sm font-mono">
          CYBERPDF NEXUS © 2024 // UNAUTHORIZED ACCESS MONITORED
        </p>
      </footer>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-black/90 border-t border-green-500/30 backdrop-blur-lg px-6 py-3 flex justify-around items-center">
         <button onClick={() => setActiveTool(null)} className={`p-2 rounded-lg flex flex-col items-center ${!activeTool ? 'text-green-400' : 'text-gray-500'}`}>
           <Home className="w-6 h-6" />
           <span className="text-[10px] mt-1 font-mono">HOME</span>
         </button>
         <button className="p-2 rounded-lg flex flex-col items-center text-gray-500 hover:text-green-400">
            <Zap className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-mono">TOOLS</span>
         </button>
      </div>

    </div>
  );
};

export default App;
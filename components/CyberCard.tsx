import React from 'react';
import { motion } from 'framer-motion';
import { ToolDef } from '../constants';
import { ChevronRight } from 'lucide-react';

interface CyberCardProps {
  tool: ToolDef;
  onClick: () => void;
  index: number;
}

const CyberCard: React.FC<CyberCardProps> = ({ tool, onClick, index }) => {
  const Icon = tool.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover="hover"
      onClick={onClick}
      className="group relative bg-black/60 border border-green-500/30 backdrop-blur-sm p-6 rounded-xl cursor-pointer overflow-hidden transition-all duration-300 hover:border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
    >
      {/* Background Circuit Pattern Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>

      <div className="flex flex-col h-full relative z-10">
        <motion.div 
          className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-900/20 border border-green-500/50"
          variants={{
            hover: {
              scale: 1.1,
              backgroundColor: "rgba(34, 197, 94, 0.2)",
              borderColor: "rgb(74, 222, 128)",
              boxShadow: "0 0 25px rgba(34, 197, 94, 0.6)"
            }
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            variants={{
              hover: {
                scale: 1.1,
                filter: "drop-shadow(0 0 10px rgba(34,197,94,1))",
                color: "#ffffff"
              }
            }}
          >
             <Icon className="w-6 h-6 text-green-400" />
          </motion.div>
        </motion.div>
        
        <h3 className="text-lg font-bold text-white mb-2 cyber-font tracking-wide group-hover:text-green-400 transition-colors">
          {tool.title}
        </h3>
        
        <p className="text-sm text-gray-400 mb-6 flex-grow font-light leading-relaxed">
          {tool.description}
        </p>
        
        <div className="flex items-center text-green-500 text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300">
          Access Tool <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500/30 rounded-tr-xl group-hover:border-green-400 transition-colors"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500/30 rounded-bl-xl group-hover:border-green-400 transition-colors"></div>
    </motion.div>
  );
};

export default CyberCard;
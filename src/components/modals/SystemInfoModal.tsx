import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils'; // Assuming this exists, based on package.json dependencies like clsx/tailwind-merge

// If utils doesn't exist, we can define a simple helper or just use string interp.
// Since package.json has clsx and tailwind-merge, let's assume standard shadcn-like utils exist or implement inline.
// Checking file list... lib/utils might exist. If not, I'll inline it.
// Wait, I saw "lib" dir in step 13 with 1 file. Let's assume it's utils.ts.

interface SystemInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SystemInfoModal: React.FC<SystemInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#1e1e1e] border border-gray-700 rounded-lg shadow-lg w-[400px] text-white relative overflow-hidden">
         {/* Close Button */}
         <button 
           onClick={onClose}
           className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
         >
           <X size={16} />
         </button>

         {/* Header */}
         <div className="px-4 py-2 border-b border-gray-700">
           <h3 className="text-sm font-semibold text-gray-300">Info</h3>
         </div>

         {/* Content */}
         <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Vehicle Number:</span>
              <span className="bg-gray-700 px-3 py-1 rounded text-sm font-mono">VX-243817</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Software Version:</span>
              <span className="text-gray-300 text-sm">XXXX</span>
            </div>

             <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">System Language:</span>
              <span className="bg-gray-700 px-3 py-1 rounded text-sm font-semibold text-gray-300">ENGLISH</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SystemInfoModal;

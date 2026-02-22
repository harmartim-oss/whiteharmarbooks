import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import Markdown from 'react-markdown';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const LegalModal = ({ isOpen, onClose, title, content }: LegalModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl max-h-[80vh] bg-[#fdfcf8] rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-black/5 flex items-center justify-between">
              <h2 className="text-2xl font-bold uppercase tracking-tight">{title}</h2>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-lg"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 no-scrollbar">
              <div className="prose prose-lg max-w-none font-serif text-[#1a1a1a]/80">
                <Markdown>{content}</Markdown>
              </div>
            </div>

            {/* Footer / Close Hint */}
            <div className="p-6 text-center border-t border-black/5">
              <button
                onClick={onClose}
                className="text-xs uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity"
              >
                Click anywhere outside to close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

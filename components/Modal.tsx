
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
  type?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, description, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
        <div className={`p-6 text-center ${
          type === 'TRAP' ? 'bg-red-50' : 
          type === 'BONUS' ? 'bg-blue-50' : 
          type === 'CHALLENGE' ? 'bg-purple-50' : 
          'bg-slate-50'
        }`}>
          <h3 className={`text-2xl font-bold mb-2 ${
            type === 'TRAP' ? 'text-red-600' : 
            type === 'BONUS' ? 'text-blue-600' : 
            type === 'CHALLENGE' ? 'text-purple-600' : 
            'text-slate-800'
          }`}>{title}</h3>
          <p className="text-slate-600 text-lg leading-relaxed">{description}</p>
        </div>
        <div className="p-4 bg-white border-t flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors shadow-lg"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

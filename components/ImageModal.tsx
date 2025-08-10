
import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface ImageModalProps {
    isOpen: boolean;
    imageUrl: string;
    prompt: string;
    onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, prompt, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-base-200 border border-base-300 rounded-lg shadow-2xl max-w-4xl w-full relative transform transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute -top-4 -right-4 bg-base-300 rounded-full p-1 text-content-200 hover:text-white hover:bg-brand-primary transition-all"
                    aria-label="Close image view"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>
                <div className="p-4">
                    <img src={imageUrl} alt={prompt} className="w-full h-auto max-h-[70vh] object-contain rounded-md" />
                </div>
                <div className="p-4 bg-base-300/50 border-t border-base-300">
                    <p className="text-sm text-content-200 italic">{prompt}</p>
                </div>
            </div>
        </div>
    );
};

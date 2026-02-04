import React from 'react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isDestructive }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-[2px] animate-fade-in p-4" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 scale-100 animate-pop-in">
                <h3 className={`text-lg font-bold mb-2 ${isDestructive ? 'text-red-600' : 'text-blue-600'}`}>
                    {title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {message}
                </p>
                <div className="flex gap-3 justify-end">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-transform active:scale-95
                            ${isDestructive 
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' 
                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
                            }`}
                    >
                        Ya, {isDestructive ? 'Keluar' : 'Lanjutkan'}
                    </button>
                </div>
            </div>
        </div>
    );
}
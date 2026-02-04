import React from 'react';

export default function Notification({ isOpen, onClose, title, message, type, buttonText }) {
    if (!isOpen) return null;
    const getStyle = () => {
        switch (type) {
            case 'success':
                return {
                    iconColor: 'bg-green-100 text-green-600',
                    btnColor: 'bg-green-600 hover:bg-green-700',
                    icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    )
                };
            case 'error':
                return {
                    iconColor: 'bg-red-100 text-red-600',
                    btnColor: 'bg-red-600 hover:bg-red-700',
                    icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    )
                };
            default:
                return {
                    iconColor: 'bg-blue-100 text-blue-600',
                    btnColor: 'bg-blue-600 hover:bg-blue-700',
                    icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    )
                };
        }
    };

    const style = getStyle();

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${style.iconColor}`}>
                        {style.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                        {message}
                    </p>

                    {/* Button */}
                    <button 
                        onClick={onClose}
                        className={`w-full py-3 px-4 rounded-xl text-white font-bold shadow-md transition-all active:scale-95 ${style.btnColor}`}
                    >
                        {buttonText || "Tutup"}
                    </button>
                </div>
            </div>
        </div>
    );
}
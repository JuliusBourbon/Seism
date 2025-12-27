import React, { useState } from 'react';

export default function LegendsBar() {
    const [isOpen, setIsOpen] = useState(true);

    const legendsData = [
        { id: 1, label: 'Pin 1', color: 'bg-red-500' },
        { id: 2, label: 'Pin 2', color: 'bg-blue-500' },
        { id: 3, label: 'Pin 3', color: 'bg-green-500' },
        { id: 4, label: 'Pin 4', color: 'bg-yellow-500' },
    ];

    return (
        <div className="flex h-screen relative">
            <div className={`fixed top-4 left-4 h-[90%] flex items-center z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-[calc(95%-15px)]'}`}>
                <div className="bg-white/90 backdrop-blur-md shadow-xl border border-white/20 h-full w-64 rounded-2xl flex flex-col overflow-hidden pointer-events-auto">
                    <div className="bg-gray-50/80 p-4 border-b border-gray-100">
                        <h1 className="font-bold text-gray-800 text-lg">Map Legends</h1>
                        <p className="text-xs text-gray-500">Lorem ipsum dolor sit amet consectetur</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {legendsData.map((item) => (
                            <div key={item.id} className="group flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-md shadow-sm ${item.color} flex items-center justify-center`}>
                                         <span className="text-white/50 text-[10px]">Img</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                </div>

                                <div>
                                    <input 
                                        type="checkbox" 
                                        defaultChecked 
                                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button onClick={() => setIsOpen(!isOpen)} className="mt-6 -ml-1 bg-white shadow-md border border-gray-100 h-20 w-10 rounded-r-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 active:scale-95 transition-all pointer-events-auto" aria-label="Toggle Sidebar">
                    <svg 
                        className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
                        width="20px" 
                        height="20px" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
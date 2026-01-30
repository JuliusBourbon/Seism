import React, { useState } from 'react';

export default function LegendsBar({ markers, isCheck, toggleMarker }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            <div className="fixed top-6 left-6 z-60 pointer-events-auto">
                <a 
                    href='/' 
                    className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-100 hover:bg-white hover:scale-105 transition-all group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-gray-700 group-hover:text-blue-600 transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Back</span>
                </a>
            </div>

            <div className={`fixed top-20 left-6 h-[60%] flex items-center z-50 transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-[calc(100%-12px)]'}`}>
                
                <div className="bg-white/95 backdrop-blur-md shadow-2xl border border-white/20 h-full w-64 rounded-2xl flex flex-col overflow-hidden pointer-events-auto">
                    <div className="bg-gray-50/50 p-4 border-b border-gray-100">
                        <h1 className="font-bold text-gray-800 text-lg">Map Legends</h1>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mt-1">Data Layer</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {markers.map((marker) => {
                            const isVisible = isCheck[marker.id];
                            return (
                                <div 
                                    key={marker.id} 
                                    className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-100" 
                                    onClick={() => toggleMarker(marker.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center border border-gray-50 text-xl">
                                            {marker.legend}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">{marker.label}</span>
                                    </div>

                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-300 ${isVisible ? 'bg-blue-600 shadow-md shadow-blue-100' : 'bg-gray-200'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="white" className={`size-4 transition-transform ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                        </svg>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="ml-0 bg-white/95 backdrop-blur-md shadow-xl border-y border-r border-gray-100 h-20 w-8 rounded-r-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all pointer-events-auto group"
                >
                    <svg className={`text-gray-400 group-hover:text-blue-600 transition-all duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`} width="20px" height="20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>
        </>
    );
}
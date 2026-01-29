import logo from '../assets/logo.png';
import { useState } from 'react';

export default function LandingPage() {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [openIndex, setOpenIndex] = useState(null);
    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const questions = [
        "What data does Seism use for analysis?",
        "Is the map real-time updated?",
        "How can I contribute to the project?",
        "Is there an API available for developers?"
    ];

    return (
        <div className="font-sans text-white">
            <nav className="fixed w-full z-50 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
                            <div className="h-10 w-10 text-[#00165D] flex items-center justify-center font-bold rounded-lg shadow-lg">
                                <img src={logo} className='scale-[120%]' />
                            </div>
                            <span className="font-bold text-2xl tracking-tight">Seism</span>
                        </div>
                        <div className="hidden md:flex gap-8 font-medium text-sm text-gray-200">
                            <a href="/map" className="hover:text-white transition-colors cursor-pointer">Map</a>
                            <button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
                            <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors cursor-pointer">About Us</button>
                            <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors cursor-pointer">FAQ</button>
                            <button onClick={() => scrollToSection('credit')} className="hover:text-white transition-colors cursor-pointer">Credit</button>
                        </div>
                    </div>
                    <div>
                        <button className="px-6 py-2 bg-white text-[#00165D] font-semibold rounded-full hover:bg-gray-100 transition-all shadow-md cursor-pointer">
                            Login
                        </button>
                    </div>
                </div>
            </nav>

            <section id="home" className="min-h-screen flex items-center pt-20 bg-linear-to-b from-[#00165D] to-[#00489b]">
                <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col gap-6">
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                            Detecting Tremors <br />
                            <span className="text-blue-200">Saving Lives</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-100 leading-relaxed max-w-lg">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                        </p>
                        <div className="flex gap-4">
                            <a href="/map" className="px-8 py-4 bg-white text-[#00489b] font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                Open Map
                            </a>
                            <button onClick={() => scrollToSection('about')} className="px-8 py-4 border border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className="relative h-96 w-full bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-tr from-blue-500/20 to-purple-500/20"></div>
                        <span className="text-white/50 font-bold text-2xl">Visual Asset Placeholder</span>
                    </div>
                </div>
            </section>

            <section id="about" className="min-h-screen flex items-center bg-linear-to-b from-[#00489b] to-[#00165D]">
                <div className="max-w-7xl mx-auto px-6 w-full">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">About Seism</h2>
                        <p className="max-w-2xl mx-auto text-blue-100">
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                                <div className="h-12 w-12 bg-blue-400/20 rounded-lg mb-6 flex items-center justify-center text-2xl">
                                    ✦
                                </div>
                                <h3 className="text-xl font-bold mb-3">Feature {item}</h3>
                                <p className="text-gray-300">
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="faq" className="min-h-screen flex items-center bg-linear-to-b from-[#00165D] to-[#00489b]">
                <div className="max-w-4xl mx-auto px-6 w-full">
                    <h2 className="text-4xl font-bold mb-12 text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {questions.map((question, index) => (
                            <div 
                                key={index} 
                                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all duration-300"
                            >
                                <button 
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                                >
                                    <h3 className="text-lg font-semibold text-white">{question}</h3>
                                    
                                    <svg 
                                        className={`w-5 h-5 text-white transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                <div 
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="px-6 pb-6 text-gray-200 text-sm">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="credit" className="py-20 bg-linear-to-b from-[#00489b] to-[#00165D]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="h-16 w-16 flex items-center justify-center font-bold mx-auto mb-8 text-2xl">
                        <img src={logo} className='scale-[150%]' />
                    </div>
                    <h2 className="text-3xl font-bold mb-8">The Team Behind Seism</h2>
                    <div className="flex flex-wrap justify-center gap-8 mb-16">
                        {['Alex Doe', 'Sarah Smith', 'John React', 'Emily UI'].map((name, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="h-24 w-24 bg-white/20 rounded-full mb-4"></div>
                                <span className="font-semibold">{name}</span>
                                <span className="text-xs text-blue-200 uppercase tracking-widest">Developer</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-white/20 pt-8 text-sm text-gray-400">
                        <p>© 2024 Seism Project. All rights reserved.</p>
                        <p className="mt-2">Designed for reliability and speed.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
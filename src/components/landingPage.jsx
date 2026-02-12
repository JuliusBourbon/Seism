import logo from '../assets/logo.png';
import { useState } from 'react';
import LoginPopup from './loginPopup';
import { useNavigate } from 'react-router-dom';
import image from '../assets/image.png'
import { useNotification } from './notificationContext';
import dev from '../assets/hhe.jpeg'
import dev1 from '../assets/dev1.jpeg'
import dev2 from '../assets/dev2.jpeg'
import dev3 from '../assets/dev3.jpeg'

export default function LandingPage({ currentUser, onLoginSuccess, onLogout }) {
    const { showNotification } = useNotification();
    const isLoggedIn = !!currentUser;
    
    const navigate = useNavigate();
    const [showAuth, setShowAuth] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogin = async (formData) => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                showNotification(
                    "Login berhasil",
                    "",
                    "success",
                    "Tutup"
                );
                
                if (onLoginSuccess) {
                    onLoginSuccess(data.user); 
                }
                
                setShowAuth(false); 
                navigate('/map')
            } else {
                showNotification(
                    "Gagal Login",
                    data.error,
                    "error",
                    "Tutup"
                );
            }
        } catch (error) {
            console.error("Error:", error);
            showNotification(
                "Server Error",
                "",
                "error",
                "Tutup"
            );
        }
    };

    const handleRegister = async (formData) => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                showNotification(
                    "Registrasi Berhasil",
                    "",
                    "success",
                    "Tutup"
                );
                
                if (onLoginSuccess) {
                    onLoginSuccess(data.user);
                }
                
                setShowAuth(false); 
            } else {
                showNotification(
                    "Gagal Registrasi",
                    data.error,
                    "error",
                    "Tutup"
                );
            }
        } catch (error) {
            console.error("Error:", error);
            showNotification(
                "Error",
                "Server Error",
                "error",
                "Tutup"
            );
        }
    };

    const handleLogoutClick = () => {
        onLogout(); 
        setShowUserMenu(false); 
    };

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
    const faqData = [
    {
        question: "Data apa yang diambil dari API BMKG?",
        answer: "Kami mengambil data gempa bumi terkini, magnitudo, lokasi (lintang/bujur), kedalaman, dan potensi tsunami."
    },
    {
        question: "Apakah perlu pembayaran untuk dapat melakukan pelaporan?",
        answer: "Tidak, layanan pelaporan di Seism sepenuhnya gratis untuk membantu masyarakat."
    },
    {
        question: "Apakah keamanan data pribadi terjamin?",
        answer: "Ya, kami menggunakan enkripsi standar industri untuk melindungi informasi yang Anda berikan."
    },
    {
        question: "Bagaimana cara saya menghubungi tim Seism?",
        answer: "Anda dapat menghubungi kami melalui halaman kontak atau mengirim email ke support@seism.id."
    }
];

    return (
        <div className="font-sans text-white">
            {showAuth && (
                <LoginPopup onClose={() => setShowAuth(false)} onLogin={handleLogin} onRegister={handleRegister}/>
            )}
            <nav className="fixed w-full z-50 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
                            <div className="h-10 w-10 text-[#00165D] flex items-center justify-center font-bold rounded-lg shadow-lg">
                                <img src={logo} className='scale-[120%]' alt="Logo" />
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
                    <div className="relative">
                        {isLoggedIn ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/20"
                                >
                                    <div className="w-8 h-8 bg-[#008CFF] rounded-full flex items-center justify-center font-bold text-sm">
                                        {currentUser.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-sm max-w-[100px] truncate">
                                        {currentUser.username}
                                    </span>
                                    <span className="text-xs">▼</span>
                                </button>
                                
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-35 bg-white rounded-md shadow-xl py-2 text-gray-800 animate-fade-in z-50">
                                        <div className='flex gap-2 w-full justify-center hover:text-red-600 cursor-pointer' onClick={handleLogoutClick}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2" /><path d="M15 12h-12l3 -3" /><path d="M6 15l-3 -3" /></svg>
                                            <button className="...">Logout</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button 
                                onClick={() => setShowAuth(true)} 
                                className="px-6 py-2 bg-white cursor-pointer text-[#00165D] font-semibold rounded-full hover:bg-gray-100 transition-all shadow-md"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <section id="home" className="min-h-screen flex items-center pt-20 bg-linear-to-b from-[#00165D] to-[#00489b]">
                <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col gap-6">
                        <div className='flex items-center'>
                            <img src={logo} alt="" className='h-32 w-32'/>
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                                Seism
                            </h1>
                        </div>
                        <p className="text-lg md:text-xl text-gray-100 leading-relaxed max-w-lg">
                            Sistem informasi dan pelaporan bencana Indonesia. <br />Bergabunglah dan menjadi pelapor bencana untuk Indonesia yang lebih tanggap dan aman.
                        </p>
                        <div className="flex gap-4">
                            <a href="/map" className="px-8 py-4 bg-white text-[#00489b] font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                Open Map
                            </a>
                            <button onClick={() => scrollToSection('about')} className="px-8 cursor-pointer py-4 border border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                                Learn More
                            </button>
                        </div>
                    </div>
                    <img className="text-white/50 font-bold text-2xl rounded-2xl shadow-2xl shadow-blue-400 hover:scale-105 transition-all duration-500 ease-in-out" src={image}></img>
                </div>
            </section>

            <section id="about" className="min-h-screen flex items-center bg-linear-to-b from-[#00489b] to-[#00165D]">
                <div className="max-w-7xl mx-auto px-6 w-full grid grid-rows-3">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Apa itu Seism?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                            <div className="h-12 w-12 bg-blue-400/20 rounded-lg mb-6 flex items-center justify-center text-2xl">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-question-mark"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4" /><path d="M12 19l0 .01" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Latar Belakang</h3>
                            <p className="text-gray-300">
                                Software berbasis Website dengan map interaktif untuk memberikan informasi terhadap suatu kejadian atau bencana alam.
                            </p>
                        </div>
                        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                            <div className="h-12 w-12 bg-blue-400/20 rounded-lg mb-6 flex items-center justify-center text-2xl">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-zoom-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /><path d="M7 10l2 2l4 -4" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Informasi terpercaya</h3>
                            <p className="text-gray-300">
                                Informasi akurat dan terkini bersumber dari langsung dari API BMKG
                            </p>
                        </div>
                        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                            <div className="h-12 w-12 bg-blue-400/20 rounded-lg mb-6 flex items-center justify-center text-2xl">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-users-group"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" /><path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M17 10h2a2 2 0 0 1 2 2v1" /><path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M3 13v-1a2 2 0 0 1 2 -2h2" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Komunitas</h3>
                            <p className="text-gray-300">
                                Laporkan dan validasi suatu kejadian, jaga satu sama lain.
                            </p>
                        </div>
                    </div>
                    <div className="w-full flex justify-center items-center">
                        <h2 className="text-2xl font-medium mb-4">FYI: Seism is pronounced <span className='italic'>"SIGH-zuhm"</span></h2>
                    </div>
                </div>
            </section>

            <section id="faq" className="min-h-screen flex items-center bg-linear-to-b from-[#00165D] to-[#00489b]">
                <div className="max-w-4xl mx-auto px-6 w-full">
                    <h2 className="text-4xl font-bold mb-12 text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqData.map((item, index) => (
                            <div 
                                key={index} 
                                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all duration-300"
                            >
                                <button 
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full text-left p-6 cursor-pointer flex justify-between items-center focus:outline-none"
                                >
                                    <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                                    
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
                                            {item.answer}
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
                        <img src={logo} className='scale-[150%]' alt="Logo" />
                    </div>
                    <h2 className="text-3xl font-bold mb-8">The Team Behind Seism</h2>
                    <div className="flex flex-wrap justify-center gap-8 mb-16">
                        <div className="flex flex-col items-center gap-1">
                            <img src={dev} className='h-24 w-24 object-cover rounded-full' alt="" />
                            <span className="font-semibold">Raihan Fathir Muhammad</span>
                            <span className="text-xs text-blue-200 uppercase tracking-widest">Developer</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <img src={dev3} className='h-24 w-24 object-cover rounded-full' alt="" />
                            <span className="font-semibold">Leatry Zhalsabila Putri</span>
                            <span className="text-xs text-blue-200 uppercase tracking-widest">Developer</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <img src={dev2} className='h-24 w-24 object-cover rounded-full' alt="" />
                            <span className="font-semibold">Nindya Dzirah Awdyren</span>
                            <span className="text-xs text-blue-200 uppercase tracking-widest">Developer</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <img src={dev1} className='h-24 w-24 object-cover rounded-full' alt="" />
                            <span className="font-semibold">Nabila Syifa Az Zahra</span>
                            <span className="text-xs text-blue-200 uppercase tracking-widest">Developer</span>
                        </div>
                    </div>
                    <div className="border-t border-white/20 pt-8 text-sm text-gray-400">
                        <p>© 2026 Seism Project. All rights reserved.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
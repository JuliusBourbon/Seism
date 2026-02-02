import { useState } from "react";

export default function Profile({ onClose, currentUser, onLogout, onAuthSuccess }) {
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
        
        // Jika register, kita butuh user_id guest saat ini untuk di-upgrade
        const payload = isRegisterMode 
            ? { ...formData, user_id: currentUser?.id } 
            : { username: formData.username, password: formData.password };

        try {
            const response = await fetch(`http://localhost:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert(isRegisterMode ? "Akun berhasil diupgrade!" : "Login Berhasil!");
                if (onAuthSuccess) {
                    onAuthSuccess(data.user); 
                }
            } else {
                alert(data.error || "Gagal memproses data");
            }
        } catch (error) {
            console.error(error);
            alert("Gagal menghubungi server");
        }
    };

    const isMember = currentUser?.role === 'verified';

    return(
        <div className="bg-white rounded-2xl w-[80%] h-[80vh] relative shadow-2xl flex flex-col overflow-hidden animate-fade-in border border-gray-200" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 grid grid-cols-2 items-center sticky top-0 z-20">
                <h1 className="text-2xl font-bold text-slate-800 hidden md:block text-left">Profile</h1>
                <div className='flex justify-end'>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all cursor-pointer font-bold shadow-sm">
                    ✕
                    </button>
                </div>
            </div>

            <div className="w-full h-full py-5 px-20">
                <div className="w-full h-full flex flex-col">
                    {isMember ? (
                        <div className="flex flex-col justify-between h-full w-full">
                            <div>
                                <div className="flex items-center gap-5">
                                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-lg">
                                        {currentUser?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <p className="text-2xl font-bold text-gray-800">{currentUser?.username}</p>
                                </div>
                                <div>
                                    <p className="text-lg mb-2">Email: {currentUser?.email}</p>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider mb-8">Verified Member</span>
                                </div>
                            </div>

                            <div className="w-full flex justify-end py-10">
                                <button onClick={onLogout} className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 border border-red-200">
                                    Log Out
                                </button>
                            </div>
                            
                        </div>
                    ) : (
                        <div className="flex flex-col w-full">
                            <div className="bg-gray-100 p-4 rounded-xl mb-6 text-center">
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Status Saat Ini</p>
                                <p className="font-mono text-sm text-gray-700 truncate px-4">
                                    {currentUser?.user_identifier || "Unknown Device"}
                                </p>
                                <span className="inline-block mt-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded">Guest Mode</span>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <input 
                                    type="text" name="username" placeholder="Username" required
                                    value={formData.username} 
                                    onChange={handleChange}
                                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-black"
                                />
                                
                                {isRegisterMode && (
                                    <input 
                                        type="email" name="email" placeholder="Email Address" required
                                        value={formData.email} 
                                        onChange={handleChange}
                                        className="p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-all text-black"
                                    />
                                )}

                                <input 
                                    type="password" name="password" placeholder="Password" required
                                    value={formData.password} 
                                    onChange={handleChange}
                                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 transition-all text-black"
                                />

                                <button type="submit" className="mt-2 bg-[#008CFF] text-white font-bold py-3 rounded-xl hover:bg-blue-600 shadow-md">
                                    {isRegisterMode ? "Upgrade Akun" : "Login"}
                                </button>
                            </form>

                            <div className="mt-4 text-center text-sm">
                                <button 
                                    onClick={() => setIsRegisterMode(!isRegisterMode)}
                                    className="text-blue-500 hover:underline font-medium"
                                >
                                    {isRegisterMode ? "Sudah punya akun? Login" : "Belum daftar? Buat Akun"}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
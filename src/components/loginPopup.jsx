import { useState } from "react";

export default function LoginPopup({ onClose, onLogin, onRegister, isLoading }) {
    // State untuk menentukan mode: false = Login, true = Register
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    // State untuk menampung input user
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    // Handle perubahan input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle saat tombol submit ditekan
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Kirim data ke Parent (Nanti kita sambungkan ke API di sini)
        if (isRegisterMode) {
            onRegister(formData);
        } else {
            onLogin(formData);
        }
    };

    return (
        <div className="fixed inset-0 z-2000 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all">
            {/* Container Modal */}
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-fade-in-up font-sans">
                
                {/* Tombol Close (X) */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-white-400 hover:text-stone-300 transition-colors z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div className="flex flex-col h-full">
                    {/* Header Bagian Atas */}
                    <div className="bg-[#0066ff] p-8 text-white text-center">
                        <h2 className="text-3xl font-bold mb-2">
                            Welcome
                        </h2>
                        <p className="text-blue-100 text-sm">
                            Seism
                        </p>
                    </div>

                    {/* Form Input */}
                    <div className="p-8 pt-6">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            
                            {/* Username Field */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                                <input 
                                    type="text" 
                                    name="username"
                                    required
                                    placeholder="e.g. johndoe"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                />
                            </div>

                            {/* Email Field (Hanya muncul saat Register) */}
                            {isRegisterMode && (
                                <div className="animate-fade-in">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        required={isRegisterMode}
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    />
                                </div>
                            )}

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                />
                            </div>

                            {/* Tombol Submit Utama */}
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="mt-4 w-full bg-[#008CFF] hover:bg-[#006bbd] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Processing..." : (isRegisterMode ? "Sign Up" : "Sign In")}
                            </button>
                        </form>

                        {/* Footer Toggle (Pindah Login <-> Register) */}
                        <div className="mt-6 text-center text-sm text-gray-600">
                            {isRegisterMode ? "Already have an account? " : "New here? "}
                            <button 
                                onClick={() => {
                                    setIsRegisterMode(!isRegisterMode);
                                    setFormData({ username: '', email: '', password: '' }); // Reset form saat switch
                                }}
                                className="font-bold text-[#008CFF] hover:underline"
                            >
                                {isRegisterMode ? "Login instead" : "Create an account"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
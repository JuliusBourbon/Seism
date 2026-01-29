import { useState } from "react";

export default function LoginPopup({ onClose, onLogin, onRegister, isLoading }) {
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isRegisterMode) {
            onRegister(formData);
        } else {
            onLogin(formData);
        }
    };

    return (
        <div className="fixed inset-0 z-2000 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-fade-in-up font-sans">
                
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-white-400 hover:text-stone-300 transition-colors z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>

                <div className="flex flex-col h-full">
                    <div className="bg-[#0066ff] p-8 text-white text-center">
                        <h2 className="text-3xl font-bold mb-2">
                            Welcome
                        </h2>
                        <p className="text-blue-100 text-sm">
                            Seism
                        </p>
                    </div>

                    <div className="p-8 pt-6">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                                <input 
                                    type="text" 
                                    name="username"
                                    required
                                    placeholder="e.g. johndoe"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border text-black border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                />
                            </div>

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
                                        className="w-full px-4 py-3 text-black rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl text-black border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="mt-4 w-full bg-[#008CFF] hover:bg-[#006bbd] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Processing..." : (isRegisterMode ? "Sign Up" : "Sign In")}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-600">
                            {isRegisterMode ? "Already have an account? " : "New here? "}
                            <button 
                                onClick={() => {
                                    setIsRegisterMode(!isRegisterMode);
                                    setFormData({ username: '', email: '', password: '' });
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
import { useState, useEffect } from "react";
import logo from "../assets/seism.png"
import { useNotification } from "./notificationContext";

export default function Profile({ onClose, currentUser, onLogout, onAuthSuccess }) {
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [userReports, setUserReports] = useState([]);
    const [isLoadingReports, setIsLoadingReports] = useState(false);
    const { showNotification } = useNotification();
    const [isEditingName, setIsEditingName] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        if (currentUser) {
            setNewUsername(currentUser.username);
        }
    }, [currentUser]);

    const handleUpdateName = async () => {
        if (!newUsername.trim()) return showNotification(
                    "Username tidak boleh kosong",
                    "",
                    "error",
                    "Tutup"
                );
        if (newUsername === currentUser.username) {
            setIsEditingName(false);
            return;
        }

    setIsUpdating(true);
        try {
            const response = await fetch(`http://localhost:3000/api/users/${currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: newUsername })
            });

            const data = await response.json();

            if (response.ok) {
                showNotification(
                    "Username berhasil diubah",
                    "",
                    "success",
                    "Tutup"
                );
                setIsEditingName(false);
                if (onAuthSuccess) {
                    onAuthSuccess(data.user);
                }
            } else {
                showNotification(
                    "Error",
                    data.error,
                    "error",
                    "Tutup"
                );
            }
        } catch (error) {
            console.error(error);
            showNotification(
                "Gagal menghubungi server",
                "",
                "error",
                "Tutup"
            );
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        if (currentUser && currentUser.id) {
            setIsLoadingReports(true);
            fetch(`http://localhost:3000/api/reports/user/${currentUser.id}`)
                .then(res => res.json())
                .then(data => {
                    setUserReports(data);
                    setIsLoadingReports(false);
                })
                .catch(err => {
                    console.error("Gagal mengambil laporan user:", err);
                    setIsLoadingReports(false);
                });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isRegisterMode ? '/api/auth/register' : '/api/auth/login';
        
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
                showNotification(
                    isRegisterMode ? "Daftar Berhasil" : "Login Berhasil", 
                    ``,
                    "success",
                    "Tutup"
                );
                if (onAuthSuccess) {
                    onAuthSuccess(data.user); 
                }
            } else {
                showNotification(
                    "Gagal Masuk",
                    data.error || "Terjadi kesalahan pada server.",
                    "error",
                    "Coba Lagi"
                );
            }
        } catch (error) {
            console.error(error);
            showNotification(
                "Koneksi Terputus",
                "Gagal menghubungi server. Periksa koneksi internet Anda.",
                "error",
                "Tutup"
            );
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'valid': return 'bg-green-100 text-green-700 border-green-200';
            case 'invalid': return 'bg-red-100 text-red-700 border-red-200';
            case 'resolved': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const isMember = currentUser?.role === 'verified';

    return (
        <div className="bg-white rounded-2xl w-[80%] h-[80vh] relative shadow-2xl flex flex-col overflow-hidden animate-fade-in border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 grid grid-cols-2 items-center sticky top-0 z-20">
                <h1 className="text-2xl font-bold text-slate-800 hidden md:block text-left">Profil Pengguna</h1>
                <div className='flex justify-end'>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all cursor-pointer font-bold shadow-sm">
                    ✕
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col h-full">
                    
                    {currentUser ? (
                        <div className="flex flex-col h-full gap-6">
                            <div className="flex flex-col items-center bg-linear-to-b from-blue-100 to-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm shrink-0">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg ring-4 ring-blue-50">
                                    {currentUser.username?.charAt(0).toUpperCase()}
                                </div>
                                {isEditingName ? (
                                    <div className="flex items-center gap-2 mb-1 w-full max-w-[200px]">
                                        <input 
                                            type="text" 
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            className="w-full text-center px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 font-bold text-gray-900"
                                            autoFocus
                                        />
                                        <button 
                                            onClick={handleUpdateName}
                                            disabled={isUpdating}
                                            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l5 5l10 -10" /></svg>
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setIsEditingName(false);
                                                setNewUsername(currentUser.username);
                                            }}
                                            className="p-2 bg-gray-300/20 text-gray-700 rounded hover:bg-gray-400/40"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 mb-1 relative">
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {currentUser.username}
                                        </h2>
                                        <button 
                                            onClick={() => setIsEditingName(true)}
                                            className="transition-opacity p-1 cursor-pointer"
                                            title="Edit Username"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="blue" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                                <p className="text-sm text-gray-500 mb-1">{currentUser.email}</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mt-2 
                                    ${currentUser.role === 'suspended' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {currentUser.role} Account
                                </span>

                                <div>
                                    <button 
                                        onClick={onLogout}
                                        className="mt-6 px-6 cursor-pointer py-2 border border-red-400 text-red-600 rounded-full text-sm font-bold hover:bg-red-50 transition-all w-full"
                                    >
                                        Keluar Akun
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col min-h-0">
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                                    Riwayat Laporan ({userReports.length})
                                </h3>
                                
                                <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                                    {isLoadingReports ? (
                                        <p className="text-center text-gray-400 text-sm py-4">Memuat data...</p>
                                    ) : userReports.length === 0 ? (
                                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                            <p className="text-gray-400 text-sm font-medium">Belum ada laporan yang dibuat.</p>
                                        </div>
                                    ) : (
                                        userReports.map((report) => (
                                            <div key={report.id} className="p-3 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white flex justify-between items-start gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                                            {report.type}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400">
                                                            {formatDate(report.created_at)}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-bold text-sm text-gray-800 truncate" title={report.title}>
                                                        {report.title}
                                                    </h4>
                                                    <h1 className="text-sm">"{report.description}"</h1>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {report.location_name || "Lokasi Pin"}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(report.status)}`}>
                                                        {report.status}
                                                    </span>
                                                    <div className="flex gap-2 text-sm font-bold text-gray-400">
                                                        <span className="text-green-600 flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg> 
                                                            {report.upvotes}
                                                        </span>
                                                        <span className="text-red-600 flex items-center gap-1">
                                                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                            {report.downvotes}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-4">
                            <div className="flex flex-col items-center gap-5">
                                <div>
                                    <img src={logo} alt="" className="w-32 h-32"/>
                                    <h1 className="text-5xl font-semibold text-blue-600">Seism</h1>
                                </div>
                                <div className="mb-6 text-center">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {isRegisterMode ? "Buat Akun Baru" : "Selamat Datang"}
                                    </h2>
                                    <p className="text-gray-500 mt-1">
                                        {isRegisterMode ? "" : "Login untuk mulai melapor"}
                                    </p>
                                </div>
                                <form onSubmit={handleSubmit} className="w-full space-y-4">
                                    <input 
                                        type="text" name="username" placeholder="Username" required
                                        value={formData.username} 
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 placeholder:text-gray-400"
                                    />
                                    
                                    {isRegisterMode && (
                                        <input 
                                            type="email" name="email" placeholder="Email Address" required
                                            value={formData.email} 
                                            onChange={handleChange}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 placeholder:text-gray-400"
                                        />
                                    )}

                                    <input 
                                        type="password" name="password" placeholder="Password" required
                                        value={formData.password} 
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800 placeholder:text-gray-400"
                                    />

                                    <button type="submit" className="w-full cursor-pointer mt-4 bg-linear-to-r from-[#008CFF] to-blue-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95">
                                        {isRegisterMode ? "Daftar Sekarang" : "Masuk"}
                                    </button>
                                </form>
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-500">
                                        {isRegisterMode ? "Sudah punya akun?" : "Belum punya akun?"}
                                    </p>
                                    <button 
                                        onClick={() => setIsRegisterMode(!isRegisterMode)}
                                        className="text-blue-600 cursor-pointer hover:text-blue-700 font-bold text-sm mt-1 hover:underline"
                                    >
                                        {isRegisterMode ? "Login di sini" : "Daftar akun baru"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
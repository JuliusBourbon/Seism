import { useState, useEffect } from "react"
import LocationPicker from "./locationPicker";

export default function Form({onClose, currentUser, onSuccess}) {
    const [userLocation, setUserLocation] = useState({ lat: null, lon: null });
    const [gpsError, setGpsError] = useState(null);
    const [formData, setFormData] = useState({
        user_name: '',
        title: '',
        type: 'Banjir',
        description: '',
        lat: null,
        lon: null,
        location_name: '',
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                    console.log("Lokasi User Terdeteksi:", position.coords);
                },
                (error) => {
                    console.error("Error GPS:", error);
                    setGpsError("Gagal mendeteksi lokasi. Pastikan GPS aktif dan izinkan akses lokasi.");
                }
            );
        } else {
            setGpsError("Browser Anda tidak mendukung Geolocation.");
        }
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                user_name: currentUser.username
            }));
        }
    }, [currentUser]);

    const handleLocationUpdate = (newCoords) => {
        setFormData(prev => ({
            ...prev,
            lat: newCoords.lat,
            lon: newCoords.lng
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userLocation.lat || !userLocation.lon) {
            alert("Sedang mendeteksi lokasi Anda... Mohon tunggu.");
            return;
        }

        if (!currentUser || !currentUser.id) {
            alert("Anda wajib login untuk mengirim laporan!");
            return;
        }

        const data = new FormData();
        
        data.append('user_id', currentUser.id);
        

        data.append('user_name', formData.user_name);
        data.append('title', formData.title);
        data.append('type', formData.type);
        data.append('description', formData.description);
        data.append('lat', formData.lat);
        data.append('lon', formData.lon);
        data.append('location_name', formData.location_name);
        data.append('user_device_lat', userLocation.lat);
        data.append('user_device_lon', userLocation.lon);
        
        if (imageFile) {
            data.append('image', imageFile);
        }

        try {
            const response = await fetch('http://localhost:3000/api/reports', {
                method: 'POST',
                body: data
            });

            const result = await response.json(); 

            if (response.ok) {
                if (onSuccess) onSuccess(result.data); 
                onClose(); 
            } else {
                alert(result.error || "Gagal mengirim laporan.");
            }

        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan koneksi.");
        }
    };

    return(
        <div className="bg-white rounded-2xl w-[65%] h-[85%] relative pointer-events-auto shadow-2xl mt-15">
            <div className="absolute top-0 z-1 w-full">
                <div className="flex justify-end mr-7 mt-5">
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all cursor-pointer font-bold shadow-sm">✕</button>
                </div>
            </div>
            <div className="w-full h-full flex flex-col gap-10 items-center">
                <div className="flex mt-5 justify-center text-3xl font-semibold">
                    <h1>Form Laporan Bencana</h1>
                </div>
                {gpsError && (
                    <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-2 text-center text-sm z-50">
                        {gpsError}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block font-semibold text-gray-700 mb-2">Judul Laporan</label>
                            <input 
                                type="text" 
                                placeholder="Contoh: Banjir setinggi lutut di Jl. Sudirman"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder:text-gray-400"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">Jenis Kejadian</label>
                            <select 
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white cursor-pointer"
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="Banjir">Banjir</option>
                                <option value="Gempa">Gempa</option>
                                <option value="Kebakaran">Kebakaran</option>
                                <option value="Longsor">Longsor</option>
                                <option value="Akses Tertutup">Akses Tertutup</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700 mb-2">Deskripsi Lengkap</label>
                        <textarea
                            placeholder="Jelaskan kondisi terkini, kebutuhan mendesak, atau info penting lainnya..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none h-24"
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700 mb-2">Titik Lokasi (Geser Pin)</label>
                        <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-300 shadow-inner">
                            <LocationPicker onLocationChange={handleLocationUpdate} userPosition={
                                    userLocation.lat && userLocation.lon 
                                    ? [userLocation.lat, userLocation.lon] 
                                    : null
                                } />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 italic">
                            *Pin harus berada di dalam lingkaran biru (radius 5km dari lokasi Anda).
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">Nama Lokasi / Patokan</label>
                            <input 
                                type="text" 
                                placeholder="Contoh: Depan Indomaret Point"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                onChange={(e) => setFormData({...formData, location_name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">Bukti Foto</label>
                            <input 
                                type="file" 
                                accept="image/*"
                                className="block w-full text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer border border-gray-200 rounded-xl"
                                onChange={(e) => setImageFile(e.target.files[0])}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button 
                            onClick={handleSubmit}
                            className="w-full md:w-auto bg-linear-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-xl font-bold cursor-pointer shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <span>Kirim Laporan</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
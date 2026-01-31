import { useState, useEffect } from "react"
import LocationPicker from "./locationPicker";
import { getDeviceId } from "../Data/deviceId";

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
        
        if (currentUser?.role == 'verified') {
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

        if (!currentUser) {
            alert("Loading User data...");
            return;
        }

        const data = new FormData();
        if (currentUser?.id) {
            data.append('user_id', currentUser.id);
        }
    
        const deviceId = currentUser?.user_identifier || getDeviceId(); 
        data.append('user_identifier', deviceId);
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
        <div className="bg-white rounded-2xl w-[95%] h-[85%] relative pointer-events-auto shadow-2xl mt-15">
            <div className="absolute top-0 z-1 w-full">
                <div className="flex justify-end mr-7 mt-5">
                    <button onClick={onClose} className="px-2 rounded-md text-center cursor-pointer hover:font-bold hover:shadow-2xl">✕</button>
                </div>
            </div>
            <div className="w-full h-full flex flex-col justify-between items-center">
                <div className="flex mt-5 justify-center text-3xl font-semibold">
                    <h1>Form Laporan Bencana</h1>
                </div>
                {gpsError && (
                    <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-2 text-center text-sm z-50">
                        {gpsError}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="w-[95%] h-[85%] mb-10 rounded-2xl shadow-[0px_2px_20px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center">
                    <div className="flex flex-col w-full my-5 gap-2">
                        <div className="flex gap-3 items-center justify-around mx-50">
                            <div className="mb-1">
                                <label className="block font-bold mb-2">
                                    {currentUser?.role == 'verified' ? "Username (Terdaftar)" : "Username (Boleh Anonym)"}
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Username"
                                    value={formData.user_name}
                                    
                                    readOnly={currentUser?.role == 'verified'}
                                    
                                    className={`p-1 w-full mb-2 rounded-lg border border-black/30 transition-colors
                                        ${currentUser?.role == 'verified' 
                                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed font-semibold' // Style terkunci
                                            : 'bg-white'
                                        }`}
                                    
                                    onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                                />
                            </div>
                            <div className="mb-1">
                                <label className="block font-bold mb-2">Judul Laporan</label>
                                <input 
                                    type="text" 
                                    placeholder="Judul Laporan"
                                    className="border border-black/30 p-1 w-full mb-2 rounded-lg"
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                            <div className="mb-1">
                                <label className="block font-bold mb-2">Jenis Kejadian</label>
                                <select className="border border-black/30 p-1 mb-2 w-50 rounded-lg" name="" id="" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                                    <option value="Banjir">Banjir</option>
                                    <option value="Gempa">Gempa</option>
                                    <option value="Kebakaran">Kebakaran</option>
                                    <option value="Longsor">Longsor</option>
                                    <option value="Akses Tertutup">Akses Tertutup</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-1 flex mx-50 flex-col">
                            <label className="block font-bold mb-2">Deskripsi Laporan</label>
                            <textarea
                                placeholder="Deskripsi"
                                className="border border-black/30 p-1 mb-2 resize-none bg-transparent outline-none rounded-lg"
                                rows='3'
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>

                        <div className="mb-1 flex mx-50 flex-col">
                            <label className="block font-bold mb-2">Lokasi Kejadian</label>
                            <LocationPicker onLocationChange={handleLocationUpdate} />
                        </div>
                        <div className="flex mx-50 justify-around items-center">
                            <div className="">
                                <label className="block font-bold mb-2">Detail Lokasi</label>
                                <input 
                                    type="text" 
                                    placeholder="Detail Lokasi"
                                    className="border border-black/30 p-1 w-full mb-2 rounded-lg"
                                    onChange={(e) => setFormData({...formData, location_name: e.target.value})}
                                />
                            </div>

                            <div className="flex flex-col w-full my-5 gap-2">
                                <div className="mb-1 flex mx-50 flex-col">
                                    <label className="block font-bold mb-2">Foto Kejadian</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <button type="submit" className="bg-linear-to-b from-[#0028ac] to-[#008CFF] cursor-pointer bg-red-600 text-white px-10 py-2 rounded-lg text-lg font-semibold">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
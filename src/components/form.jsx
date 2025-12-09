import { useState } from "react"
import LocationPicker from "./locationPicker";

export default function Form({onClose, currentUser}) {
    const [formData, setFormData] = useState({
        user_name: '',
        title: '',
        type: 'Banjir',
        description: '',
        lat: null,
        lon: null,
        location_name: '',
    });

    const handleLocationUpdate = (newCoords) => {
        setFormData(prev => ({
            ...prev,
            lat: newCoords.lat,
            lon: newCoords.lng
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert("Loading User data, please wait..");
            return;
        }

        if (!formData.lat || !formData.lon) {
            alert("Mohon pilih lokasi kejadian di peta!");
            return;
        }

        const payload = {
            user_id: currentUser.id,
            ...formData
        }

        console.log('Sending data: ', payload)

        try {
            const response = await fetch('http://localhost:3000/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Report Sent!");
            } else {
                alert("Failed to sending report!");
            }

        } catch (error) {
            console.error("Connection Error:", error);
        }
    };
    return(
        <div className="bg-white rounded-lg w-[90%] h-[80%] relative pointer-events-auto border shadow-2xl">
            <div className="absolute z-1 w-full">
                <div className="flex justify-end mr-7 mt-5">
                    <h1 onClick={onClose} className="px-2 rounded-md text-center cursor-pointer hover:font-bold hover:shadow-2xl">X</h1>
                </div>
            </div>
            <div className="text-center mt-5">
                <h1>Form</h1>
            </div>
            <form onSubmit={handleSubmit} className=" mt-5 p-4 bg-white shadow rounded">
                <div className="mb-1">
                    <label className="block text-sm font-bold mb-2">Username (Boleh Anonym)</label>
                    <input 
                        type="text" 
                        placeholder="Username"
                        className="border p-2 w-full mb-2"
                        onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                    />
                </div>
                <div className="mb-1">
                    <label className="block text-sm font-bold mb-2">Judul Laporan</label>
                    <input 
                        type="text" 
                        placeholder="Judul Laporan"
                        className="border p-2 w-full mb-2"
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>
                <div className="mb-1">
                    <label className="block text-sm font-bold mb-2">Jenis Kejadian</label>
                    <select className="border p-2 w-full mb-2" name="" id="" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                        <option value="Banjir">Banjir</option>
                        <option value="Gempa">Gempa</option>
                        <option value="Kebakaran">Kebakaran</option>
                        <option value="Longsor">Longsor</option>
                        <option value="Kecelakaan">Kecelakaan</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>
                <div className="mb-1">
                    <label className="block text-sm font-bold mb-2">Deskripsi Laporan</label>
                    <input
                        type="text" 
                        placeholder="Deskripsi"
                        className="border p-2 w-full mb-2"
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <div className="mb-1">
                    <label className="block text-sm font-bold mb-2">Lokasi Kejadian</label>
                    <LocationPicker onLocationChange={handleLocationUpdate} />
                </div>
                <div className="mb-1">
                    <label className="block text-sm font-bold mb-2">Detail Lokasi</label>
                    <input 
                        type="text" 
                        placeholder="Nama Lokasi"
                        className="border p-2 w-full mb-2"
                        onChange={(e) => setFormData({...formData, location_name: e.target.value})}
                    />
                </div>

                <button type="submit" className="cursor-pointer bg-red-600 text-white p-2 rounded">
                    Kirim Laporan
                </button>
            </form>
        </div>
    )
}
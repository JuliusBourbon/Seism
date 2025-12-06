import { useState } from "react"

export default function Form({onClose}) {
    const [formData, setFormData] = useState({
        user_id: '',
        user_name: '',
        title: '',
        type: '',
        description: '',
        lat: '',
        lon: '',
        location_name: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            user_id: 1,
        };

        try {
            const response = await fetch('http://localhost:3000/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
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
                <input 
                    type="text" 
                    placeholder="Username (Boleh Anonym)"
                    className="border p-2 w-full mb-2"
                    onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                />
                <input 
                    type="text" 
                    placeholder="Judul Laporan"
                    className="border p-2 w-full mb-2"
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
                <select className="border p-2 w-full mb-2" name="" id="" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                    <option value="Banjir">Banjir</option>
                    <option value="Gempa">Gempa</option>
                    <option value="Kebakaran">Kebakaran</option>
                    <option value="Longsor">Longsor</option>
                    <option value="Kecelakaan">Kecelakaan</option>
                    <option value="Lainnya">Lainnya</option>
                </select>
                <input
                    type="text" 
                    placeholder="Deskripsi"
                    className="border p-2 w-full mb-2"
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
                <input 
                    type="text" 
                    placeholder="Latitude"
                    className="border p-2 w-full mb-2"
                    onChange={(e) => setFormData({...formData, lat: e.target.value})}
                />
                <input 
                    type="text" 
                    placeholder="Longtitude"
                    className="border p-2 w-full mb-2"
                    onChange={(e) => setFormData({...formData, lon: e.target.value})}
                />
                <input 
                    type="text" 
                    placeholder="Nama Lokasi"
                    className="border p-2 w-full mb-2"
                    onChange={(e) => setFormData({...formData, location_name: e.target.value})}
                />

                <button type="submit" className="cursor-pointer bg-red-600 text-white p-2 rounded">
                    Kirim Laporan
                </button>
            </form>
        </div>
    )
}
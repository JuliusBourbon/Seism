import { useState } from "react"

export default function Form({onClose}) {
    const [formData, setFormData] = useState({
        title: '',
        user_name: '',
        description: '',
        type: 'Banjir'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            user_id: 1,
            latitude: -6.2088,
            longitude: 106.8456,
            location_name: "Jakarta (Dummy)" 
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
            <div>
                <h1>Form</h1>
            </div>
            <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
                <input 
                    type="text" 
                    placeholder="Judul Laporan"
                    className="border p-2 w-full mb-2"
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
                
                <input 
                    type="text" 
                    placeholder="Nama Samaran (Opsional)"
                    className="border p-2 w-full mb-2"
                    onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                />

                <button type="submit" className="cursor-pointer bg-red-600 text-white p-2 rounded">
                    Kirim Laporan 🚀
                </button>
            </form>
        </div>
    )
}
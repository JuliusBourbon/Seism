import { useState, useEffect } from "react"
export default function DataGempa(){
    const [gempaUtama, setGempaUtama] = useState(null); // Untuk data tunggal (Auto Gempa)
    const [daftarGempa, setDaftarGempa] = useState([]); // Untuk data list (Gempa Dirasakan)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Siapkan kedua URL
                const urlAuto = 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json';
                const urlList = 'https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json';

                // FETCH PARALEL: Jalankan keduanya bersamaan
                const [resAuto, resList] = await Promise.all([
                    fetch(urlAuto),
                    fetch(urlList)
                ]);

                // Ubah keduanya jadi JSON
                const dataAuto = await resAuto.json();
                const dataList = await resList.json();

                // Simpan ke state masing-masing
                setGempaUtama(dataAuto.Infogempa.gempa);
                setDaftarGempa(dataList.Infogempa.gempa);

                setLoading(false);

            } catch (error) {
                console.error("Gagal mengambil data:", error);
                setLoading(false);
            }
            };

        fetchAllData();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Data BMKG...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
        
            {/* BAGIAN 1: Highlight Gempa Terbaru (Dari autogempa.json) */}
            {gempaUtama && (
                <div className="bg-red-600 text-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold mb-2">🚨 Peringatan Dini / Gempa Terbaru</h2>
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <p className="text-4xl font-bold mb-1">{gempaUtama.Magnitude} SR</p>
                            <p className="opacity-90">{gempaUtama.Tanggal} - {gempaUtama.Jam}</p>
                        </div>
                        <div className="mt-4 md:mt-0 text-center md:text-right">
                            <p className="text-lg font-semibold">{gempaUtama.Wilayah}</p>
                            <p className="text-sm bg-red-700 inline-block px-2 py-1 rounded mt-2">
                                Potensi: {gempaUtama.Potensi}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* BAGIAN 2: List Gempa Lainnya (Dari gempadirasakan.json) */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Riwayat Gempa Dirasakan</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    {daftarGempa.map((gempa, idx) => (
                        <div key={idx} className="bg-white p-4 border rounded shadow-sm hover:shadow-md">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-bold text-gray-700">{gempa.Wilayah}</p>
                                    <p className="text-xs text-gray-500">{gempa.Tanggal} | {gempa.Jam}</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-orange-600">{gempa.Magnitude} SR</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
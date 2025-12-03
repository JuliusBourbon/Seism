import { useState, useEffect } from 'react';
import { Location } from '../Data/location';
const BASE_URL = 'https://api.bmkg.go.id/publik/prakiraan-cuaca';

export default function Cuaca() {
  const [allCuaca, setAllCuaca] = useState([]);
  const [loadingCuaca, setLoadingCuaca] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoadingCuaca(true);
      try {
        const fetchPromises = Location.map(async (loc) => {
          try {

            const response = await fetch(`${BASE_URL}?adm4=${loc.kode}`);
            const json = await response.json();
            
            if (!json.data || json.data.length === 0) return null;
            
            const dataLokasi = json.data[0].lokasi;
            const dataCuaca = json.data[0].cuaca;
            
            return {
              id: loc.kode,
              lokasi: {
                ...dataLokasi,
                lat: parseFloat(dataLokasi.lat), 
                lon: parseFloat(dataLokasi.lon)
              },
              current: dataCuaca.flat()
            };
          } catch (err) {
            console.warn(`Failed fetch ${loc.nama}`, err);
            return null;
          }
        });

        const results = await Promise.all(fetchPromises);
        setAllCuaca(results.filter(item => item !== null));
        setLoadingCuaca(false);

      } catch (error) {
        console.error("Gagal mengambil data massal:", error);
        setLoadingCuaca(false);
      }
    };

    fetchAll();
  }, []);

  return { allCuaca, loadingCuaca };
};
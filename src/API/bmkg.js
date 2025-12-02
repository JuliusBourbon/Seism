import { useState, useEffect } from 'react';

const useBMKG = (type = 'auto') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const endpoint = type === 'auto' ? 'autogempa.json' : 'gempadirasakan.json';
        const url = `https://data.bmkg.go.id/DataMKG/TEWS/${endpoint}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Gagal ambil data');
        
        const json = await response.json();
        
        setData(json.Infogempa.gempa);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  return { data, loading, error };
};

export default useBMKG;
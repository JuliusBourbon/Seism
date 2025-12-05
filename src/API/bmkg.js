import { useState, useEffect } from 'react';

const useBMKG = (type = 'auto') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed Fetching Data');
        
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
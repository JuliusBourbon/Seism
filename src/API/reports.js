import { useState, useEffect } from 'react';

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
        const response = await fetch('http://localhost:3000/api/reports');
        const data = await response.json();
        
        setReports(data);
        setLoading(false);
        } catch (err) {
        console.error("Failed to fetch Reports data:", err);
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);
    return { reports, loading, refetch: fetchReports };
}
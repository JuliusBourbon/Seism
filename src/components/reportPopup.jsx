import { useState, useEffect } from "react";

export default function ReportPopup({ report, currentUser }) {
    
    const [votes, setVotes] = useState({
        up: report.upvotes || 0,
        down: report.downvotes || 0
    });

    const [userVote, setUserVote] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (currentUser) {
            fetch(`http://localhost:3000/api/reports/${report.id}/vote-status?user_id=${currentUser.id}`)
                .then(res => res.json())
                .then(data => {
                    setUserVote(data.voted);
                })
                .catch(err => console.error(err));
        }
    }, [report.id, currentUser]);

    const handleVote = async (type) => {
        if (!currentUser) {
            alert("Silakan login untuk memberikan vote!");
            return;
        }
        if (isLoading) return;

        setIsLoading(true);


        try {
            const response = await fetch(`http://localhost:3000/api/reports/${report.id}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    user_id: currentUser.id,
                    type: type 
                })
            });

            const data = await response.json();

            if (response.ok) {
                setVotes({
                    up: data.new_counts.upvotes,
                    down: data.new_counts.downvotes
                });

                if (userVote === type) {
                    setUserVote(null);
                } else {
                    setUserVote(type); 
                }
            } else {
                alert("Gagal voting");
            }
        } catch (error) {
            console.error("Vote Error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const getRealtimeStatus = () => {
        const { up, down } = votes;
        if (report.status === 'resolved') {
            return 'resolved';
        }
        if ((up - down) <= -10) {
            return 'invalid';
        }
        if ((up + down) > 10 && up >= (2 * down)) {
            return 'valid';
        }
        return 'pending';
    };

    const currentStatus = getRealtimeStatus();

    const getStatusColor = (status) => {
        switch (status) {
            case 'valid': return 'bg-green-100 text-green-700 border-green-200 ring-1 ring-green-500';
            case 'invalid': return 'bg-red-100 text-red-700 border-red-200 ring-1 ring-red-500';
            case 'resolved': return 'bg-blue-100 text-blue-700 border-blue-200 ring-1 ring-blue-500';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };

    const date = new Date(report.created_at)
    const formatted = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}, 
        ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;

    return (
    <div className="w-[300px] font-sans text-gray-800">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${report.reporter_role === 'verified' ? 'bg-blue-600' : 'bg-gray-400'}`}>
                    {report.user_name ? report.user_name.charAt(0).toUpperCase() : '?'}
                </div>
                
                <div className="flex flex-col">
                    <span className="text-sm font-bold leading-none text-gray-900 truncate max-w-[120px]">
                        {report.user_name || "Anonim"}
                    </span>
                    <span className={`text-[10px] font-semibold mt-0.5 uppercase tracking-wide ${report.reporter_role === 'verified' ? 'text-blue-600' : 'text-gray-500'}`}>
                        {report.reporter_role || 'Guest'}
                    </span>
                </div>
            </div>

            <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                {formatted}
            </span>
        </div>

        <div className="flex items-center justify-between gap-2 mb-3">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                ${report.type === 'Banjir' ? 'bg-blue-100 text-blue-600 border-blue-200 ring-1 ring-blue-500' :
                report.type === 'Kebakaran' ? 'bg-red-100 text-red-600 border-red-200 ring-1 ring-red-500' :
                report.type === 'Gempa' ? 'bg-purple-100 text-purple-600 border-purple-200 ring-1 ring-purple-500' :
                report.type === 'Longsor' ? 'bg-red-100 text-orange-600 border-orange-200 ring-1 ring-orange-500' :
                report.type === 'Akses Tertutup' ? 'bg-yellow-100 text-yellow-600 border-yellow-200 ring-1 ring-yellow-500' :
                'bg-gray-100 text-gray-600'}`}>
                {report.type}
            </span>

            <span className={`px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-wider border ${getStatusColor(currentStatus)} transition-all duration-300`}>
                {currentStatus}
            </span>
        </div>

        <h3 className="font-bold text-base leading-snug mb-2 text-gray-900">
            {report.title}
        </h3>

        {report.image_url && (
            <div className="mb-3 rounded-xl overflow-hidden h-36 w-full bg-gray-100 border border-gray-200 shadow-sm relative group">
                <img 
                    src={report.image_url}
                    alt="Bukti Laporan" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
        )}

        <div className="bg-gray-50 px-3 rounded-lg border border-gray-100 mb-3">
            <p className="text-sm leading-relaxed line-clamp-4 italic">
                {report.description || "Tidak ada deskripsi tambahan."}
            </p>
        </div>

        <div className="flex items-start gap-2 mb-4 p-2 bg-blue-50/50 rounded-lg border border-blue-100">
            <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700 line-clamp-1">{report.location_name || "Lokasi Pin"}</span>
                <span className="text-sm text-gray-400 font-mono">
                    {parseFloat(report.lat).toFixed(5)}, {parseFloat(report.lon).toFixed(5)}
                </span>
            </div>
        </div>

        <div className="flex gap-1 items-center justify-between pt-2 mt-1">
            <button
                onClick={() => handleVote('up')}
                disabled={isLoading}
                className={`flex items-center gap-1.5 w-full py-1 rounded-md transition-all group
                    ${userVote === 'up'
                        ? 'bg-green-100 text-green-700 font-bold ring-1 ring-green-400'
                        : 'hover:bg-green-50 text-gray-600 hover:text-green-600'}`
                }
            >
                <svg className="w-4 h-4" fill={userVote === 'up' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                <div className="flex flex-col items-start leading-none">
                    <span className="font-bold text-sm">{votes.up}</span>
                    <span className="text-[9px] uppercase">UpVote</span>
                </div>
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <button
                onClick={() => handleVote('down')}
                disabled={isLoading}
                className={`flex items-center justify-end gap-1.5 w-full py-1 rounded-md transition-all group
                    ${userVote === 'down'
                        ? 'bg-red-100 text-red-700 font-bold ring-1 ring-red-400'
                        : 'hover:bg-red-50 text-gray-600 hover:text-red-600'}`
                }
            >
                <div className="flex flex-col items-end leading-none">
                    <span className="font-bold text-sm">{votes.down}</span>
                    <span className="text-[9px] uppercase">DownVote</span>
                </div>
                <svg className="w-4 h-4" fill={userVote === 'down' ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
        </div>
    </div>
);
}
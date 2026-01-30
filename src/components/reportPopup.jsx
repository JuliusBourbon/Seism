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
    return(

        <div className="w-[280px] font-sans">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400" title={report.user_identifier}>
                    {report.user_name}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide 
                    ${report.type === 'Banjir' ? 'bg-blue-100 text-blue-600' : 
                    report.type === 'Kebakaran' ? 'bg-red-100 text-red-600' :
                    report.type === 'Gempa' ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-600'}`}>
                    {report.type}
                </span>
            </div>

            {report.image_url && (
                <div className="mb-3 rounded-lg overflow-hidden h-32 w-full bg-gray-100">
                    <img 
                        src={report.image_url}
                        alt="Bukti Laporan" 
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="mb-3">
                <h2 className="font-bold text-lg leading-tight text-gray-800 mb-1">
                    {report.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3 leading-snug">
                    "{report.description}"
                </p>
            </div>

            <div className="flex items-start gap-1 mb-3 text-xs text-gray-500">
                <svg className="w-3 h-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className="font-medium">{report.location_name || "Lokasi tidak terdeteksi"} | {report.lat} {report.lon}</span>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-1">
                
                {/* Tombol UP */}
                <button 
                    onClick={() => handleVote('up')} 
                    disabled={isLoading}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all group
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
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all group
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
    )
}
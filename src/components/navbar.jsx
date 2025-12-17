import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar({ activeTab, setActiveTab, onOpenData, onOpenForm }){
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') {
            setActiveTab('home');
        }
    }, [location.pathname, setActiveTab]);

    const navClass = (tabName) => {
        const baseClass = "cursor-pointer px-5 py-3 rounded-[36px] transition-all duration-300";
        const activeClass = "bg-[#D9D9D9]/25 font-bold shadow-[inset_0px_3px_4px_rgba(0,0,0,0.35)]";
        const inactiveClass = "hover:bg-[#D9D9D9]/15";

        return `${baseClass} ${activeTab === tabName ? activeClass : inactiveClass}`;
    };
    return(
        <div className="flex pointer-events-none justify-center mt-7 relative z-50">
            <div className="bg-linear-to-b from-[#0028ac] to-[#008CFF] text-white rounded-[36px] pointer-events-auto shadow-xl p-2">
                <div className="flex gap-1">
                    <NavLink className={navClass('home')} onClick={() => setActiveTab('home')} to='/'>
                        <h1>Home</h1>
                    </NavLink>
                    <button className={navClass('data')} onClick={() => {setActiveTab('data'); if(onOpenData) onOpenData();}}>
                        <h1>Table</h1>
                    </button>
                    <button className={navClass('form')} onClick={() => {setActiveTab('form'); if(onOpenForm) onOpenForm();}} >
                        <h1>Form</h1>
                    </button>
                </div>
            </div>
        </div>
    )
}
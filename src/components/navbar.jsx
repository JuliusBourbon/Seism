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
        const baseClass = "cursor-pointer px-5 py-3 rounded-3xl transition-all duration-300";
        const activeClass = "bg-blue-950 font-bold shadow-inner";
        const inactiveClass = "hover:bg-blue-600";

        return `${baseClass} ${activeTab === tabName ? activeClass : inactiveClass}`;
    };
    return(
        <nav className="flex pointer-events-none justify-center mt-7 relative z-50">
            <div className="bg-blue-800 text-white rounded-3xl pointer-events-auto shadow-xl">
                <div className="flex gap-1">
                    <NavLink className={navClass('home')} onClick={() => setActiveTab('home')} to='/'>
                        <h1>Home</h1>
                    </NavLink>
                    <div className={navClass('data')} onClick={() => {setActiveTab('data'); if(onOpenData) onOpenData();}}>
                        <h1>Table</h1>
                    </div>
                    <div className={navClass('form')} onClick={() => {setActiveTab('form'); if(onOpenForm) onOpenForm();}} >
                        <h1>Form</h1>
                    </div>
                </div>
            </div>
        </nav>
    )
}
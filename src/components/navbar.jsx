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
        const baseClass = "flex jusify-center items-center gap-2 cursor-pointer px-3 py-3 rounded-[36px] transition-all duration-300";
        const activeClass = "bg-[#D9D9D9]/25 font-bold shadow-[inset_0px_3px_4px_rgba(0,0,0,0.35)]";
        const inactiveClass = "hover:bg-[#D9D9D9]/15";

        return `${baseClass} ${activeTab === tabName ? activeClass : inactiveClass}`;
    };
    return(
        <div className="flex pointer-events-none justify-center mt-7 relative z-50">
            <div className="bg-linear-to-b from-[#0028ac] to-[#008CFF] text-white rounded-[36px] pointer-events-auto shadow-xl p-2">
                <div className="flex gap-1">
                    <NavLink className={navClass('home')} onClick={() => setActiveTab('home')} to='/'>
                        <svg className="" width="32px" height="32px" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                            <path d="M9 19L3.78974 20.7368C3.40122 20.8663 3 20.5771 3 20.1675L3 5.43246C3 5.1742 3.16526 4.94491 3.41026 4.86325L9 3M9 19L15 21M9 19L9 3M15 21L20.5897 19.1368C20.8347 19.0551 21 18.8258 21 18.5675L21 3.83246C21 3.42292 20.5988 3.13374 20.2103 3.26325L15 5M15 21L15 5M15 5L9 3" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        {activeTab === 'home' && <h1 className="transition-all duration-300 opacity-100">Home</h1>}
                    </NavLink>
                    <button className={navClass('data')} onClick={() => {setActiveTab('data'); if(onOpenData) onOpenData();}}>
                        <svg width="32px" height="32px" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                            <path d="M7 6L17 6" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M7 9L17 9" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M9 17H15" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M3 12H2.6C2.26863 12 2 12.2686 2 12.6V21.4C2 21.7314 2.26863 22 2.6 22H21.4C21.7314 22 22 21.7314 22 21.4V12.6C22 12.2686 21.7314 12 21.4 12H21M3 12V2.6C3 2.26863 3.26863 2 3.6 2H20.4C20.7314 2 21 2.26863 21 2.6V12M3 12H21" stroke="#FFFFFF" stroke-width="2"></path></svg>
                        {activeTab === 'data' && <h1 className="transition-all duration-300 opacity-100">Table</h1>}
                    </button>
                    <button className={navClass('form')} onClick={() => {setActiveTab('form'); if(onOpenForm) onOpenForm();}} >
                        <svg width="32px" height="32px" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                            <path d="M22 14V8.5M6 13V6C6 4.34315 7.34315 3 9 3H14" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M16.9922 4H19.9922M22.9922 4L19.9922 4M19.9922 4V1M19.9922 4V7" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M12 21H6C3.79086 21 2 19.2091 2 17C2 14.7909 3.79086 13 6 13H17H18C15.7909 13 14 14.7909 14 17C14 19.2091 15.7909 21 18 21C20.2091 21 22 19.2091 22 17V14" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        {activeTab === 'form' && <h1 className="transition-all duration-300 opacity-100">Form</h1>}
                    </button>
                </div>
            </div>
        </div>
    )
}
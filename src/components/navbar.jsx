import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar({ activeTab, setActiveTab, onOpenData, onOpenForm, onOpenProfile, onOpenHelp }){
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/') {
            setActiveTab('home');
        }
    }, [location.pathname, setActiveTab]);

    const navClass = (tabName) => {
        const baseClass = "flex text-xl jusify-center items-center gap-2 cursor-pointer px-3 py-3 rounded-[36px] transition-all duration-300";
        const activeClass = "bg-[#D9D9D9]/25 font-bold shadow-[inset_0px_3px_4px_rgba(0,0,0,0.35)]";
        const inactiveClass = "hover:bg-[#D9D9D9]/15";

        return `${baseClass} ${activeTab === tabName ? activeClass : inactiveClass}`;
    };
    return(
        <div className="flex pointer-events-none justify-center mt-5 relative z-50">
            <div className="bg-linear-to-b from-[#0028ac] to-[#008CFF] text-white rounded-[36px] pointer-events-auto shadow-xl p-2">
                <div className="flex gap-1">
                    <NavLink className={navClass('home')} onClick={() => setActiveTab('home')} to='/'>
                        <svg className="" width="30px" height="30px" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                            <path d="M9 19L3.78974 20.7368C3.40122 20.8663 3 20.5771 3 20.1675L3 5.43246C3 5.1742 3.16526 4.94491 3.41026 4.86325L9 3M9 19L15 21M9 19L9 3M15 21L20.5897 19.1368C20.8347 19.0551 21 18.8258 21 18.5675L21 3.83246C21 3.42292 20.5988 3.13374 20.2103 3.26325L15 5M15 21L15 5M15 5L9 3" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        {activeTab === 'home' && <h1 className="transition-all duration-300 opacity-100">Maps</h1>}
                    </NavLink>
                    <button className={navClass('data')} onClick={() => {setActiveTab('data'); if(onOpenData) onOpenData();}}>
                        <svg width="30px" height="30px" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                            <path d="M7 6L17 6" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M7 9L17 9" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M9 17H15" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M3 12H2.6C2.26863 12 2 12.2686 2 12.6V21.4C2 21.7314 2.26863 22 2.6 22H21.4C21.7314 22 22 21.7314 22 21.4V12.6C22 12.2686 21.7314 12 21.4 12H21M3 12V2.6C3 2.26863 3.26863 2 3.6 2H20.4C20.7314 2 21 2.26863 21 2.6V12M3 12H21" stroke="#FFFFFF" stroke-width="2"></path></svg>
                        {activeTab === 'data' && <h1 className="transition-all duration-300 opacity-100">Data</h1>}
                    </button>
                    <button className={navClass('form')} onClick={() => {setActiveTab('form'); if(onOpenForm) onOpenForm();}} >
                        <svg width="30px" height="30px" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                            <path d="M22 14V8.5M6 13V6C6 4.34315 7.34315 3 9 3H14" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M16.9922 4H19.9922M22.9922 4L19.9922 4M19.9922 4V1M19.9922 4V7" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M12 21H6C3.79086 21 2 19.2091 2 17C2 14.7909 3.79086 13 6 13H17H18C15.7909 13 14 14.7909 14 17C14 19.2091 15.7909 21 18 21C20.2091 21 22 19.2091 22 17V14" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        {activeTab === 'form' && <h1 className="transition-all duration-300 opacity-100">Lapor</h1>}
                    </button>
                    <button className={navClass('profile')} onClick={() => {setActiveTab('profile'); if(onOpenProfile) onOpenProfile();}} >
                        <svg width="30px" height="30px" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#ffffff">
                            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.271 18.3457C4.271 18.3457 6.50002 15.5 12 15.5C17.5 15.5 19.7291 18.3457 19.7291 18.3457" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        {activeTab === 'profile' && <h1 className="transition-all duration-300 opacity-100">Profile</h1>}
                    </button>
                    <button className={navClass('help')} onClick={() => {setActiveTab('help'); if(onOpenHelp) onOpenHelp();}} >
                        <svg width="30px" height="30px" viewBox="0 0 24 24" stroke-width="2" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                            <path d="M4 11.4998L3.51493 11.6211C2.62459 11.8437 2 12.6436 2 13.5614V15.4382C2 16.356 2.62459 17.1559 3.51493 17.3785L5.25448 17.8134C5.63317 17.9081 6 17.6217 6 17.2313V11.7683C6 11.3779 5.63317 11.0915 5.25448 11.1862L4 11.4998ZM4 11.4998V11C4 6.58172 7.58172 3 12 3C16.4183 3 20 6.58172 20 11V11.4998M20 11.4998L20.4851 11.6211C21.3754 11.8437 22 12.6436 22 13.5614V15.4382C22 16.356 21.3754 17.1559 20.4851 17.3785L20 17.4998M20 11.4998L18.7455 11.1862C18.3668 11.0915 18 11.3779 18 11.7683V17.2313C18 17.6217 18.3668 17.9081 18.7455 17.8134L20 17.4998M15 20.5H18C19.1046 20.5 20 19.6046 20 18.5V18V17.4998M15 20.5C15 19.6716 14.3284 19 13.5 19H10.5C9.67157 19 9 19.6716 9 20.5C9 21.3284 9.67157 22 10.5 22H13.5C14.3284 22 15 21.3284 15 20.5Z" stroke="#FFFFFF" stroke-width="2"></path>
                        </svg>
                        {activeTab === 'help' && <h1 className="transition-all duration-300 opacity-100">Bantuan</h1>}
                    </button>
                </div>
            </div>
        </div>
    )
}
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar(){
    const [isForm, setIsForm] = useState(false)
    return(
        <nav className="flex pointer-events-none justify-center mt-7">
            <div className="bg-blue-900 text-white px-5 py-3 rounded-3xl pointer-events-auto">
                <div className="flex gap-5">
                    <NavLink to='/'>
                        <h1>Home</h1>
                    </NavLink>
                    <NavLink to='/data'>
                        <h1>Data</h1>
                    </NavLink>
                    <div>
                        <h1>Form</h1>
                    </div>
                </div>
            </div>
        </nav>
    )
}
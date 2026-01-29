import { useState, useEffect } from 'react'
import { getDeviceId } from './Data/deviceId'
import { Routes, Route, useLocation  } from 'react-router-dom'
import './App.css'
import Map from './components/map'
import LandingPage from './components/landingPage'

export default function App(){
  const [currentUser, setCurrentUser] = useState(null);

  const fetchGuestUser = async () => {
    const id = getDeviceId();
    try {
        const response = await fetch('http://localhost:3000/api/auth/guest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ device_id: id })
        });
        const data = await response.json();
        if (response.ok) {
            console.log("Mode Guest Aktif:", data.user);
            setCurrentUser(data.user);
        }
    } catch (error) {
        console.error("Gagal login guest:", error);
    }
  };

  useEffect(() => {
    fetchGuestUser();
  }, []);

  const handleLoginSuccess = (userData) => {
    console.log("User Login:", userData);
    if (userData.user_identifier) {
        localStorage.setItem('device_id', userData.user_identifier);
    }
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    const confirm = window.confirm("Yakin ingin keluar akun?");
    if (confirm) {
        localStorage.removeItem('device_id'); 
        setCurrentUser(null);
        
        fetchGuestUser(); 
        alert("Anda telah logout. Kembali ke mode Guest.");
    }
  };


  return(
    <div>
      <main>
        <Routes>
          <Route path='/' element={<LandingPage currentUser={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout}/>} />
          <Route path='/Map' element={<Map currentUser={currentUser} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout}/>}/>
        </Routes>
      </main>
    </div>
  )
}
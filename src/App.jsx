import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Map from './components/map'
import LandingPage from './components/landingPage'

export default function App(){
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_session');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Gagal memuat sesi:", error);
        localStorage.removeItem('user_session');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    console.log("User Login:", userData);
    localStorage.setItem('user_session', JSON.stringify(userData)); 
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    const confirm = window.confirm("Yakin ingin keluar akun?");
    if (confirm) {
        localStorage.removeItem('user_session'); 
        setCurrentUser(null);
        alert("Anda telah logout.");
    }
  };

  return(
    <div>
      <main>
        <Routes>
          <Route 
            path='/' 
            element={
              <LandingPage 
                currentUser={currentUser} 
                onLoginSuccess={handleLoginSuccess} 
                onLogout={handleLogout}
              />
            } 
          />
          <Route 
            path='/Map' 
            element={
              <Map 
                currentUser={currentUser} 
                onLoginSuccess={handleLoginSuccess} 
                onLogout={handleLogout}
              />
            }
          />
        </Routes>
      </main>
    </div>
  )
}
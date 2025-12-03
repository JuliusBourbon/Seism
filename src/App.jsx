import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route, useLocation  } from 'react-router-dom'
import './App.css'
import DataGempa from './components/dataGempa'
import Form from './components/form'
import Map from './components/map'

export default function App(){
  return(
    <div>

      <main>
        <Routes>
          <Route path='/' element={<Map/>}/>
          <Route path='/data' element={<DataGempa/>}/>
        </Routes>

      </main>
    </div>
  )
}
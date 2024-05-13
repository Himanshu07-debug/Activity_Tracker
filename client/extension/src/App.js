import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import { useState } from 'react';
import MainHeader from './components/MainHeader';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    return (token !== null || refreshToken !== null);
  });

  return (
    <div className="h-screen w-screen overflow-x-hidden overflow-y-auto flex flex-col bg-[#010B13]">
      
      <Navbar isLoggedIn = {isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <Routes>
        <Route path="/" element={<MainHeader />} >
          <Route index element={<Home isLoggedIn = {isLoggedIn} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} />
        </Route>

      </Routes>

    </div>
  );
}

export default App;

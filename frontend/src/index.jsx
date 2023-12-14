import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Uzivo from './pages/Uzivo/Uzivo';
import Registracija from './pages/Registracija/Registracija';
import UserPage from './pages/UserPage/UserPage';
import Konferencije from './pages/Konferencije/Konferencije'

const Main = () => {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/uzivo' element={<Uzivo />} />
        <Route exact path='/registracija' element={<Registracija />} />
        <Route exact path='/UserPage' element={<UserPage />} />
        <Route exact path='/konferencije' element={<Konferencije />}/>
      </Routes>
    </>
  );
}

export default Main;

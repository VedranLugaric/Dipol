import React from 'react'
import {Route, Routes } from 'react-router-dom'

import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Uzivo from './pages/Uzivo/Uzivo'
import Registracija from './pages/Registracija/Registracija'

const Main = () => {
  return (
    <>
    <Routes>
        <Route exact path='/' element={<Home />}></Route>
        <Route exact path='/login' element={<Login />}></Route>
        <Route exact path='/uzivo' element={<Uzivo />}></Route>
        <Route exact path='/registracija' element={<Registracija />}></Route>
    </Routes>
    </>
  );
}

export default Main;
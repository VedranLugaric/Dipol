import React from 'react'
import {Route, Routes } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Uzivo from './pages/Uzivo'

const Main = () => {
  return (
    <>
    <Routes>
        <Route exact path='/' element={<Home />}></Route>
        <Route exact path='/login' element={<Login />}></Route>
        <Route exact path='/uzivo' element={<Uzivo />}></Route>
    </Routes>
    </>
  );
}

export default Main;
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Uzivo from './pages/Uzivo/Uzivo'
import Registracija from './pages/Registracija/Registracija'
import UserPage from './pages/UserPage/UserPage'
import Konferencije from './pages/Konferencije/Konferencije'
import Poster from './pages/Poster/Poster'
import DodajKonferenciju from './pages/Superadmin/DodajKonferenciju'
import DodajPoster from './pages/Admin/DodajPoster'
import ProsleKonferencije from './pages/ProsleKonferencije/ProsleKonferencije'
import StariRadovi from './pages/StariRadovi/StariRadovi'
import PregledRadova from './pages/Superadmin/PregledRadova'
import Galerija from './pages/Galerija/Galerija'
import DodajVoditelja from './pages/Superadmin/DodajVoditelja'
import DodajPokrovitelja from './pages/Superadmin/DodajPokrovitelja'
import DodajFotografije from './pages/Superadmin/DodajFotografije'

const Main = () => {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/live/:konferencijaId' element={<Uzivo />} />
        <Route exact path='/registracija' element={<Registracija />} />
        <Route exact path='/UserPage' element={<UserPage />} />
        <Route exact path='/konferencije' element={<Konferencije />}/>
        <Route path="/posteri/:konferencijaId" element={<Poster />} />
        <Route exact path='/dodajkonferenciju' element={<DodajKonferenciju />}/>
        <Route exact path='/dodajposter' element={<DodajPoster />}/>
        <Route path="/proslekonferencije" element={<ProsleKonferencije />} />
        <Route path="/stariradovi/:id" element={<StariRadovi />} />
        <Route path='/pregled-radova/:konferencijaId' element={<PregledRadova />} />
        <Route path='/galerija/:konferencijaId' element={<Galerija />}></Route>
        <Route path='/dodaj-voditelja/:konferencijaId' element={<DodajVoditelja />}></Route>
        <Route path='/dodaj-pokrovitelja/:konferencijaId' element={<DodajPokrovitelja />}></Route>
        <Route path='/dodaj-fotografije/:konferencijaId' element={<DodajFotografije />}></Route>
        <Route path="/galerija/:konferencijaId" element={<Galerija />} />
      </Routes>
    </>
  );
}

export default Main;

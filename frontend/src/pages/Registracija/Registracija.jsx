import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FallingAnimation from '../../FallingAnimation';
import '../Login/Login.css';
import './Registracija.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthContext';

const Registracija = () => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState('');
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [lozinkaPotvrda, setLozinkaPotvrda] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('../konferencije');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setError(null);
  
    if (lozinka !== lozinkaPotvrda) {
      setError("Lozinke se ne podudaraju.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await axios({
        method: 'post',
        url: 'http://localhost:5000/api/registracija/',
        data: {
          ime: ime,
          prezime: prezime,
          email: user,
          lozinka: lozinka,
          lozinkaPotvrda: lozinkaPotvrda
        },
      });
  
      setUser('');
      setIme('');
      setPrezime('');
      setLozinka('');
      setLozinkaPotvrda('');
  
      setError("Poslana pošta za verifikaciju na email: " + user);
    } catch (error) {
      setError("Račun s ovim emailom već postoji.");
    } finally {
      setIsLoading(false);
    }
  };  
  

  return (
    <FallingAnimation>
      <div className='background'>
        <div className='registrationBody'>
          <div className='first'>
            <form className='registrationForm' onSubmit={handleSubmit}>
              <div className='textInputs'>
                <label htmlFor='name'>
                  <input
                    type='text'
                    className='registrationInputText'
                    id='name'
                    placeholder='Ime'
                    onChange={(e) => setIme(e.target.value)}
                    value={ime}
                    required
                  ></input>
                </label>
                <label htmlFor='prezime'>
                  <input
                    type='text'
                    className='registrationInputText'
                    id='prezime'
                    placeholder='Prezime'
                    onChange={(e) => setPrezime(e.target.value)}
                    value={prezime}
                    required
                  ></input>
                </label>
                <label htmlFor='username'>
                  <input
                    type='email'
                    id='username'
                    className='registrationInputText'
                    placeholder='Email'
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                  ></input>
                </label>
                <label htmlFor='lozinka'>
                  <input
                    type='password'
                    className='registrationInputText'
                    id='lozinka'
                    placeholder='Lozinka'
                    onChange={(e) => setLozinka(e.target.value)}
                    value={lozinka}
                    required
                  />
                </label>
                <label htmlFor='lozinkaPotvrda'>
                  <input
                    type='password'
                    className='registrationInputText'
                    id='lozinkaPotvrda'
                    placeholder='Potvrdi lozinku'
                    onChange={(e) => setLozinkaPotvrda(e.target.value)}
                    value={lozinkaPotvrda}
                    required
                  />
                </label>
                {/* Reserve space for error message or loader */}
                <div className="errorText">
                  {isLoading ? <div className="loader"></div> : error && <p>{error}</p>}
                </div>
              </div>
              <button className='registrationInputSubmit'>Registriraj se</button>
            </form>
          </div>
          <div className='seconds'>
            <h1 className='welcome'>Dobrodošli!</h1>
          </div>
        </div>
      </div>
    </FallingAnimation>
  );
};

export default Registracija;

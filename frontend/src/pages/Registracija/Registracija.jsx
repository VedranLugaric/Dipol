import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FallingAnimation from '../../FallingAnimation';
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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirect to another route if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('../konferencije'); // Change this to the route you want to redirect to
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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


      //obriši formu za registraciju
      setUser('');
      setIme('');
      setPrezime('');
      setLozinka('');
      setLozinkaPotvrda('');

      setError(false)
      //setSuccess(true);


      navigate('/login')
      
    } catch (error) {

      setError(error.response.data.poruka);
      setSuccess(false);
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
                <button className='registrationInputSubmit'>Registriraj se</button>
              </div>
            </form>
          </div>
          <div className='seconds'>
            {error && <div className="error-message">{error}</div>}
            {/* {success && <div className="success-message">Uspješna registracija!</div>} */}
            <h1 className='welcome'>Dobrodošli!</h1>
          </div>
        </div>
      </div>
    </FallingAnimation>
  );
};

export default Registracija;

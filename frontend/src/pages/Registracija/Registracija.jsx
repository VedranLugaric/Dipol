import React, { useState } from 'react';
import axios from 'axios';
import FallingAnimation from '../../FallingAnimation';
import './Registracija.css';

const Registracija = () => {
  const [user, setUser] = useState('');
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios({
        method: 'post',
        url: 'http://localhost:5000/api/registracija/',
        data: {
          ime: ime,
          prezime: prezime,
          email: user
        },
      });


      //obriši formu za registraciju
      setUser('');
      setIme('');
      setPrezime('');

      setError(false)
      setSuccess(true);
      console.log(response.data);
    } catch (error) {
      console.error('Morate unijeti sve podatke!', error);

      setError(error.response.data.message || 'Morate unijeti sve podatke!');
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
                  ></input>
                </label>
                <label htmlFor='username'>
                  <input
                    type='email'
                    id='username'
                    className='registrationInputText'
                    placeholder='Korisničko ime/Email'
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                  ></input>
                </label>
                <button className='registrationInputSubmit'>Registriraj se</button>
              </div>
            </form>
          </div>
          <div className='seconds'>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Uspješna registracija!</div>}
            <h1 className='welcome'>Dobrodošli!</h1>
          </div>
        </div>
      </div>
    </FallingAnimation>
  );
};

export default Registracija;

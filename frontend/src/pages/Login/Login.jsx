import React, { useRef, useState } from 'react';
import FallingAnimation from '../../FallingAnimation';
import './Login.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthContext';

const Login = () => {
  const [user, setUser] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user,
          lozinka: lozinka,
        }),
      });
  
      if (response.status === 200) {
        // Redirect only if login is successful
        navigate('/konferencije');
      } else {
        // Handle other response statuses, e.g., display an error message
        setErrMsg('Pogrešan email ili lozinka');
      }
    } catch (error) {
      // Handle other errors
      setErrMsg('Pogreška prilikom prijave');
    }
  };

  return (
    <FallingAnimation>
      {/*    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live='assertive'>{errMsg}</p> */}
      <div className='background'>
        <div className='loginBody'>
          <div className='firsts'>
            <h1 className='welcome'>Dobrodošli natrag!</h1>
          </div>
          
          <div className='second'>
            <form className='loginForm' onSubmit={handleSubmit}>
              <div className='textInputs'>
              <label htmlFor='username'>
                  <input
                    type='email'
                    id='username'
                    className='registrationInputText'
                    placeholder='Email'
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
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
                  />
                </label>
              </div>
              <button className='loginInputSubmit'>Log in</button>
            </form>
          </div>
        </div>
      </div>
    </FallingAnimation>
  );
};



export default Login;

import React, { useRef, useState } from 'react';
import axios from 'axios';
import FallingAnimation from '../../FallingAnimation';
import './Login.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthContext';

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //poziv funkcije iz AuthContext
      await login(user);

      setSuccess(true);
      setErrMsg('');

      navigate('/UserPage');
    } catch (error) {
      setSuccess(false);
      setErrMsg('Pogrešan e-mail.');
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
                    type='text'
                    id='username'
                    className='loginInputText'
                    placeholder='Korisničko ime'
                    ref={userRef}
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                  ></input>
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

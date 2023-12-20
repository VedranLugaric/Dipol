import React, { useRef, useState, useEffect } from 'react';
import FallingAnimation from '../../FallingAnimation';
import './Login.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {

  let ulogirani = false
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const { isAuthenticated } = useAuth();

  const [capVal, setCapVal] = useState(null);
  // Redirect to another route if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('../konferencije'); // Change this to the route you want to redirect to
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //poziv funkcije iz AuthContext
      await login(user, lozinka);

      setSuccess(true);

      setErrMsg('');

      navigate('/konferencije');
    } catch (error) {
      navigate('/login')
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
                    type='email'
                    id='username'
                    className='loginInputText'
                    placeholder='Korisničko ime'
                    ref={userRef}
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                  ></input>
                </label>
                <label htmlFor='lozinka'>
                  <input
                    type='password'
                    id='lozinka'
                    className='loginInputText'
                    placeholder='Lozinka'
                    ref={userRef}
                    onChange={(e) => setLozinka(e.target.value)}
                    value={lozinka}
                    required
                  ></input>
                </label>
              </div>
              <ReCAPTCHA
                sitekey="6Lf3iTcpAAAAAOGZ13_kzm2WxGmzGxB9-dEaxnu8"
                onChange={val => setCapVal(val)} 
              />
              <button className='loginInputSubmit' disabled={!capVal}>Log in</button>
            </form>
          </div>
        </div>
      </div>
    </FallingAnimation>
  );
};



export default Login;

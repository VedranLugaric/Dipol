import React, { useRef, useState, useEffect } from 'react';
import FallingAnimation from '../../FallingAnimation';
import '../Registracija/Registracija.css';
import './Login.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {

  const userRef = useRef();

  const [user, setUser] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const { isAuthenticated } = useAuth();

  const [capVal, setCapVal] = useState(null);
  useEffect(() => {
    if (isAuthenticated) {
      navigate('../konferencije');
    }
  }, [isAuthenticated, navigate]);

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setError(null);
  
    if (!capVal) {
      setError("Molimo da riješite reCAPTCHA-u prije nastavka");
      return;
    }
  
    setIsLoading(true);
  
    try {
      await login(user, lozinka);
      navigate('/konferencije');
    } catch (error) {
      if (error.message === 'Korisnik nije verificiran') {
        setError("Korisnik nije verificiran");
      } else {
        setError(error.message);
      }
    } finally{
      setIsLoading(false);
    }
  };
  

  return (
    <FallingAnimation>
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
                    placeholder='Email'
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
                <div className="errorText">
                    {isLoading ? <div className="loader"></div> : error && <p>{error}</p>}
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

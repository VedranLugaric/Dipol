import React, { useRef, useState } from 'react';
import axios from 'axios';
import FallingAnimation from '../../FallingAnimation';
import './Login.css';

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user, pwd);
    try {
      const response = await axios({
        method: 'post',
        url: 'http://localhost:5173/registracija',
      });
      console.log(response.data);
    } catch (error) {
      console.error('An error occurred:', error);
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
                <label htmlFor='password'>
                  <input
                    type='password'
                    className='loginInputText'
                    id='password'
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder='Lozinka'
                    value={pwd}
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

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import FallingAnimation from '../../FallingAnimation';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';


import './Home.css';

const Home = () => {

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/konferencije');
    }
  }, [isAuthenticated, navigate]);

  return (
    <FallingAnimation>
      <div className='mid'>
        <div className='midContents'>
          <h1 className='ocijenite'>OCIJENITE RAD</h1>
          <span className='teksthome'>Postanite član "ime organizacije" i dobijte mogućnost
            objavljivanja, ocjenjivanja i praćenja radova. U nekoliko klikova možete pratiti
            live prijenos bilo koje aktivne konferencije!</span>
          <div className='midBtns'>
            <Link to='/Registracija'>
              <button className='midBtn1'>Registriraj se</button>
            </Link>
            <Link to='/Login'>
              <button className='midBtn2'>Ulogiraj se</button>
            </Link>
          </div>
        </div>
      </div>
    </FallingAnimation>
  );
};

export default Home;
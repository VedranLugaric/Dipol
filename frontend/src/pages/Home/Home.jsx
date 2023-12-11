import { Link } from 'react-router-dom';
import FallingAnimation from '../../FallingAnimation';

import './Home.css';

const Home = () => {
  return (
    <FallingAnimation>
      <div className='mid'>
        <div className='midContents'>
          <h1>OCIJENITE RAD</h1>
          <a className='tekst'>Postanite član "ime organizacije" i dobijte mogućnost 
            objavljivanja, ocjenjivanja i praćenja radova. U nekoliko klikova možete pratiti
            live prijenos bilo koje aktivne konferencije!</a>
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
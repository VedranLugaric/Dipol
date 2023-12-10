import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
    return (
        <>
        <div className='mid'>
          <div className='midContents'>
            <h1>OCIJENITE RAD</h1>
            <a className='tekst'>Postanite član "ime organizacije" i dobite mogućnost 
              objavljivanja, ocjenjivanja i praćenja radova. U nekoliko klikova možete pratiti
              live prijenos bilokoje aktivne konferencije!</a>
            <div className='midBtns'>
              <button className='midBtn1'>Registriraj se</button>
              <Link to='/Login'>
                <button className='midBtn2'>Ulogiraj se</button>
              </Link>
            </div>
          </div>
        </div>
      </>
    )
}

export default Home
import FallingAnimation from '../../FallingAnimation'
import './Galerija.css'
import bird from './bird.jpg'
const Galerija = () => {
    return (
        <>
        <hr></hr>
        <FallingAnimation>
        <h2 className='galerija'>Galerija konferencije 'Ime'</h2>
        <div className='conf-button-galerija'>
        </div>
        <div className='galerija-container'>
            <div className='fotografija'>
                <img className='foto' src={bird}></img>
                <a href={bird} download>
                    <button className='download-button'>Preuzmi</button>
                </a>
            </div>
            <div className='fotografija'>
                <img className='foto' src={bird}></img>
                <a href={bird} download>
                    <button className='download-button'>Preuzmi</button>
                </a>
            </div>
            <div className='fotografija'>
                <img className='foto' src={bird}></img>
                <a href={bird} download>
                    <button className='download-button'>Preuzmi</button>
                </a>
            </div>
            <div className='fotografija'>
                <img className='foto' src={bird}></img>
                <a href={bird} download>
                    <button className='download-button'>Preuzmi</button>
                </a>
            </div>
            <div className='fotografija'>
                <img className='foto' src={bird}></img>
                <a href={bird} download>
                    <button className='download-button'>Preuzmi</button>
                </a>
            </div>
            <div className='fotografija'>
                <img className='foto' src={bird}></img>
                <a href={bird} download>
                    <button className='download-button'>Preuzmi</button>
                </a>
            </div>
            <div className='fotografija'>
                <img className='foto' src={bird}></img>
                <a href={bird} download>
                    <button className='download-button'>Preuzmi</button>
                </a>
            </div>
            <div className='fotografija'>
                <img className='foto' src={bird}></img>
                <a href={bird} download>
                    <button className='download-button'>Preuzmi</button>
                </a>
            </div>
        </div>
        </FallingAnimation>
        </>
    )
}

export default Galerija
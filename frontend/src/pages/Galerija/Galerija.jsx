import FallingAnimation from '../../FallingAnimation'
import './Galerija.css'

const Galerija = () => {
    return (
        <>
        <hr></hr>
        <FallingAnimation>
        <h2 className='galerija'>Galerija konferencije 'Ime'</h2>
        <hr></hr>
        <div className='galerija-container'>
            <div className='fotografija'>
                <img className='foto'></img>
            </div>
        </div>
        </FallingAnimation>
        </>
    )
}

export default Galerija
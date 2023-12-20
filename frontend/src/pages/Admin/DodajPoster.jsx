import './DodajPoster.css'
import '../Konferencije/Konferencije.css'
import FallingAnimation from '../../FallingAnimation'

const DodajPoster = () => {
    return (
        <>
        <FallingAnimation>
        <hr></hr>
        <div className='formcontainer'>
            <h2 className='headertext'>Dodavanje postera</h2>
            <div className='formdiv'>
                <form>
                    <input type="text" className='input' placeholder="Naziv postera" required></input>
                    <input maxLength={100} type='text' className='input' placeholder="Opis postera" required></input>
                    <label for="img" className='label'>Select image:</label>
                    <input type="file" accept=".pdf,.ppt,.png,.jpg,.jpeg" className='input'></input>
                    <button type='submit' className='submitButton'>Unesi</button>
                </form>
            </div>
        </div>
        <hr></hr>
        </FallingAnimation>
        </>
    )
}

export default DodajPoster
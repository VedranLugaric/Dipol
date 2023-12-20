import FallingAnimation from '../../FallingAnimation'
import './DodajKonferenciju.css'

const DodajKonferenciju = () => {
    return (
        <>
        <FallingAnimation>
        <hr></hr>
        <div className='formcontainer'>
            <h2 className='headertext'>Dodavanje konferencije</h2>
            <div className='formdiv'>
                <form>
                    <input type="text" className='input' placeholder="Naziv konferencije" required></input>
                    <input type="text" className='input' placeholder="Mjesto održavanja" required></input>
                    <label htmlFor='vrijemePoc' className='label'>Vrijeme početka</label>
                    <input type='time' className='input' name='vrijemePoc' required></input>
                    <label htmlFor='vrijemePoc' className='label'>Datum početka</label>
                    <input type='date' className='input' name='datumPoc' required></input>
                    <label htmlFor='vrijemePoc' className='label'>Vrijeme kraja</label>
                    <input type='time' className='input' name='vrijemeKraj' required></input>
                    <label htmlFor='vrijemePoc' className='label'>Datum kraja</label>
                    <input type='date' className='input' name='datumKraj' required></input>
                    <input maxLength={100} type='text' className='input' placeholder="Opis konferencije" required></input>
                    <button type='submit' className='submitButton'>Unesi</button>
                </form>
            </div>
        </div>
        <hr></hr>
        </FallingAnimation>
        </>
    )
}

export default DodajKonferenciju
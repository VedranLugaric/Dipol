import FallingAnimation from "../../FallingAnimation"
import './PregledRadova.css'
import { useAuth } from '../../AuthContext';
import {useNavigate } from 'react-router-dom'

const PregledRadova = () => {

    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    //hardkodirani podaci
    const radovi = [
        {
            'id' : '72',
            'naziv' : 'Rad 1',
            'opis' : 'Opis rada 1',
            'file' : "src",
            'autor' : 'autor 1',
            'prihvacen' : 'ne'
        },
        {
            'id' : '73',
            'naziv' : 'Rad 2',
            'opis' : 'Opis rada 2',
            'file' : 'src',
            'autor' : 'autor 2',
            'prihvacen' : 'ne'
        },
        {
            'id' : '74',
            'naziv' : 'Rad 3',
            'opis' : 'Opis rada 3',
            'file' : 'src',
            'autor' : 'autor 3',
            'prihvacen' : 'ne'
        }
    ]

    const handleAccept = (id) => {
        //kod koji mijenja u bazi status rada
    }
    const handleReject = (id) => {
        //kod koji brise rad iz baze mozda (ili ga ostavlja kakav je bio)
    }

    return (
        <>
        <FallingAnimation>
            <hr></hr>
            {isAdmin && (
                <div className="rad-container">
                {radovi && 
                    radovi.map((rad, index) => (
                        <>
                        <div className="rad-button-cont">
                            <div className="rad" key = {index}>
                                <div className="rad-texts">
                                    <span className="naziv">{rad.naziv}</span>
                                    <span className="autor-rada">{rad.autor}</span>
                                    <span className="opis">{rad.opis}</span>
                                </div>
                                <div className="img-div">
                                    <img className="rad-img" src={rad.src} alt = 'Src rada'/>
                                </div>
                            </div>
                            <div className="buttons">
                                    <button onClick={() => handleAccept(rad.id)} className="accept-button">Prihvati</button>
                                    <button onClick={() => handleReject(rad.id)}className="reject-button">Odbaci</button>
                            </div>
                        </div>
                        </>
                    ))}
            </div>
            )}
            {!isAdmin && (
                <div className='nemate-pristup'>
                <span className='pristup-text'>Ups! Nemate pristup ovoj stranici! :/</span>
                <button className='return' onClick={() => navigate(-1)}>Povratak</button>
            </div>
            )}
            
        </FallingAnimation>
        </>
    )
}

export default PregledRadova
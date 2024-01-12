import FallingAnimation from "../../FallingAnimation"
import './PregledRadova.css'
import { useAuth } from '../../AuthContext';
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";

const PregledRadova = ({ conferenceId }) => {

    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const { konferencijaId } = useParams();
    const [radovi, setRadovi] = useState([]);

    useEffect(() => {
        const fetchRadovi = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/odobravanje_radova/${konferencijaId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const radData = await response.json();
                    setRadovi(radData.neodobreni_radovi);
                } else {
                    console.error("Failed to fetch data");
                }
            } catch (error) {
                console.error('Fetch error:', error.message);
                throw new Error('Problem s dohvatom radova');
            }
        };

        fetchRadovi();
    }, [konferencijaId]);

    //hardkodirani podaci
    // const radovi = [
    //     {
    //         'id' : '72',
    //         'naziv' : 'Rad 1',
    //         'opis' : 'Opis rada 1',
    //         'file' : "src",
    //         'autor' : 'autor 1',
    //         'prihvacen' : 'ne'
    //     },
    //     {
    //         'id' : '73',
    //         'naziv' : 'Rad 2',
    //         'opis' : 'Opis rada 2',
    //         'file' : 'src',
    //         'autor' : 'autor 2',
    //         'prihvacen' : 'ne'
    //     },
    //     {
    //         'id' : '74',
    //         'naziv' : 'Rad 3',
    //         'opis' : 'Opis rada 3',
    //         'file' : 'src',
    //         'autor' : 'autor 3',
    //         'prihvacen' : 'ne'
    //     }
    // ]

    const handleAccept = async (id) => {
        //u bazi polje odobren stavlja u True
        try {
            const response = await fetch(`http://localhost:5000/api/potvrdi_rad/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // Include any other data you need to send to the server
                }),
            });
    
            if (response.ok) {
                // Update local state to remove the accepted work
                setRadovi((prevRadovi) => prevRadovi.filter((rad) => rad.id_rad !== id));
            } else {
                console.error("Failed to update status");
            }
        } catch (error) {
            console.error('Update error:', error.message);
            // Handle error
        }
    };


    const handleReject = async (id) => {
        //kod koji brise rad iz baze
        try {
            // Make a DELETE request to the Flask route for deleting the rad
            const response = await fetch(`http://localhost:5000/api/odbij_rad/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Update local state to remove the rejected work
                setRadovi((prevRadovi) => prevRadovi.filter((rad) => rad.id_rad !== id));
            } else {
                console.error("Failed to delete rad");
            }
        } catch (error) {
            console.error('Deletion error:', error.message);
            // Handle error
        }
    }

    return (
        <>
        <FallingAnimation>
            <hr></hr>
            {!isAdmin && (
                <div className="rad-container">
                {radovi && 
                    radovi.map((rad, index) => (
                        <>
                        <div className="rad-button-cont">
                            <div className="rad" key = {index}>
                                <div className="rad-texts">
                                    <span className="naziv">{rad.naslov}</span>
                                    <span className="autor-rada">{rad.autor}</span>
                                    <span className="opis">{rad.opis}</span>
                                </div>
                                <div className="img-div">
                                    <img className="rad-img" src={rad.poster_link} alt = 'Src rada'/>
                                </div>
                            </div>
                            <div className="buttons">
                                    <button onClick={() => handleAccept(rad.id_rad)} className="accept-button">Prihvati</button>
                                    <button onClick={() => handleReject(rad.id_rad)}className="reject-button">Odbaci</button>
                            </div>
                        </div>
                        </>
                    ))}
            </div>
            )}
            {isAdmin && (
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
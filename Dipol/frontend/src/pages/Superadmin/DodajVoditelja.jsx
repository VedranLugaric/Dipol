import FallingAnimation from '../../FallingAnimation'
import { useAuth } from '../../AuthContext';
import './DodajKonferenciju.css'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

const DodajVoditelja = () => {
    const navigate = useNavigate();
    const { konferencijaId } = useParams();
    
    const [mail, setMail] = useState('');

    const storedKorisnik = JSON.parse(localStorage.getItem('korisnik'));
    const isAdmin = storedKorisnik ? storedKorisnik.admin : false;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://dripol.onrender.com/api/dodaj_voditelja/${konferencijaId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mail: mail,
                }),
            });

            if (response.status === 200) {
                navigate('/konferencije');
            } else {
                console.error('Error adding voditelja:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <>
        <FallingAnimation>
        <hr></hr>
        {isAdmin && (
            <div className='dodaj-voditelja-cont'>
                <div className='formcontainer'>
                    <h2 className='headertext'>Dodavanje voditelja</h2>
                    <div className='formdiv'>
                        <form onSubmit={handleSubmit}>
                            <input type='email' className='input'
                            placeholder='Mail voditelja'
                            onChange={(e) => setMail(e.target.value)}
                            value={mail}
                            required></input>

                            <button type='submit' className='submitButton'>Unesi</button>
                        </form>
                    </div>
                </div>
            </div>
        )}
        {!(isAdmin) && (
            <div className='nemate-pristup'>
                <span className='pristup-text'>Ups! Nemate pristup ovoj stranici! :/</span>
                <button className='return' onClick={() => navigate(-1)}>Povratak</button>
            </div>
        )}
        </FallingAnimation>
        </>
    )
}

export default DodajVoditelja
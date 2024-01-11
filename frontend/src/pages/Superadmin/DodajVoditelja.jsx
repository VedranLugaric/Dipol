import FallingAnimation from '../../FallingAnimation'
import { useAuth } from '../../AuthContext';
import './DodajKonferenciju.css'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const DodajVoditelja = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    
    const [ime, setIme] = useState('');
    const [prezime, setPrezime] = useState('');
    const [mail, setMail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            ime,
            prezime,
            mail,
        };

        try {
            const response = await axios.post('http://localhost:5000/api/dodaj_voditelja', formData);
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
                            <input type='text' className='input'
                            placeholder='Ime voditelja'
                            onChange={(e) => setIme(e.target.value)}
                            value={ime}
                            required></input>

                            <input type='text' className='input'
                            placeholder='Prezime voditelja'
                            onChange={(e) => setPrezime(e.target.value)}
                            value={prezime}
                            required></input>

                            <input type='text' className='input'
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

export default DodajVoditelja
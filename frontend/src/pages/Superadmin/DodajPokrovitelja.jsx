import FallingAnimation from '../../FallingAnimation'
import { useAuth } from '../../AuthContext';
import './DodajKonferenciju.css'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const DodajPokrovitelja = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const [naziv, setNaziv] = useState('');
    const [logo, setLogo] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            naziv,
            logo,
        };

        try {
            const response = await axios.post('http://localhost:5000/api/dodaj_pokrovitelja', formData);
            if (response.status === 200) {
                navigate(-1);
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
                            placeholder='Ime pokrovitelja'
                            onChange={(e) => setNaziv(e.target.value)}
                            value={naziv}
                            required></input>

                            <label htmlFor="img" className='label'>
                                Odaberite logo:
                            </label>
                            <input type='file'
                            accept=".png,.jpg,.jpeg" className='input'
                            onChange={(e) => setLogo(e.target.value)}
                            value={logo}
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

export default DodajPokrovitelja
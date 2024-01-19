import FallingAnimation from '../../FallingAnimation'
import { useAuth } from '../../AuthContext';
import './DodajKonferenciju.css'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";


const DodajPokrovitelja = () => {
    const navigate = useNavigate();

    const [naziv, setNaziv] = useState('');
    const [logo, setLogo] = useState('');
    const {konferencijaId} = useParams();
    const [url, setUrl] = useState('');
    const [uploadMessage, setUploadMessage] = useState('');

    const storedKorisnik = JSON.parse(localStorage.getItem('korisnik'));
    const isVoditeljNaKonf = storedKorisnik
      ? storedKorisnik.voditelj_na_konf.includes(parseInt(konferencijaId, 10))
      : false;
    const isAdmin = storedKorisnik ? storedKorisnik.admin : false;

    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        setLogo(file);
        setUploadMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('naziv', naziv);
        formData.append('url', url);
        formData.append('logo', logo);
    
        try {
            const response = await axios.post(`https://dripol.onrender.com/api/dodaj_pokrovitelja/${konferencijaId}`, formData);
    
            if (response.status === 200) {
                navigate(-1);
            } else {
                console.error('Error adding sponsor:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };    

    return (
        <>
        <FallingAnimation>
            <hr></hr>
            {(isAdmin || isVoditeljNaKonf) && (
            <div className='dodaj-voditelja-cont'>
                <div className='formcontainer'>
                    <h2 className='headertext'>Dodavanje pokrovitelja</h2>
                    <div className='formdiv'>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="url" className='label'>
                                Unesite ime pokrovitelja:
                            </label>
                            <input type='text' className='input'
                            placeholder='Ime pokrovitelja'
                            onChange={(e) => setNaziv(e.target.value)}
                            value={naziv}
                            required></input>
                            <label htmlFor="url" className='label'>
                                Unesite URL:
                            </label>
                            <input type='text'
                                id='url'
                                className='input'
                                placeholder='URL'
                                onChange={(e) => setUrl(e.target.value)}
                                value={url}
                                required>
                            </input>
                            <label htmlFor="img" className='label'>
                                Odaberite logo:
                            </label>
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg"
                                onChange={handleLogoChange}
                                className='input'
                            />

                            <button type='submit' className='submitButton'>Unesi</button>
                        </form>
                    </div>
                </div>
            </div>
        )}
        {!(isAdmin || isVoditeljNaKonf) && (
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
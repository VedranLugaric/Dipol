import FallingAnimation from '../../FallingAnimation'
import './DodajKonferenciju.css'
import { useAuth } from '../../AuthContext';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const DodajKonferenciju = () => {
    const navigate = useNavigate();

    const [naziv, setNaziv] = useState('');
    const [mjesto, setMjesto] = useState('');
    const [vrijemePocetka, setVrijemePocetka] = useState('');
    const [vrijemeKraja, setVrijemeKraja] = useState('');
    const [datumPocetka, setDatumPocetka] = useState('');
    const [datumKraja, setDatumKraja] = useState('');
    const [opis, setOpis] = useState('');
    const [konfLozinka, setKonfLozinka] = useState('');
    const [video, setVideo] = useState('');

    const storedKorisnik = JSON.parse(localStorage.getItem('korisnik'));
    const isAdmin = storedKorisnik ? storedKorisnik.admin : false;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formatDateTime = (date, time) => {
            const combinedDateTime = new Date(`${date}T${time}`);
            const formattedDateTime = combinedDateTime.toISOString();
            return formattedDateTime;
        };

        const formData = {
            naziv,
            mjesto,
            vrijemePocetka: formatDateTime(datumPocetka, vrijemePocetka),
            vrijemeKraja: formatDateTime(datumKraja, vrijemeKraja),
            video,
            opis,
            konfLozinka,
        };

        try {
            const response = await axios.post('https://dripol.onrender.com/api/dodaj_konf', formData);
            if (response.status === 200) {
                navigate('/konferencije');
            } else {
                console.error('Error adding konferencija:', response.status);
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
            <div className='formcontainer'>
                <h2 className='headertext'>Dodavanje konferencije</h2>
                <div className='formdiv'>
                    <form onSubmit={handleSubmit}>
                        <input type="text" className='input' placeholder="Naziv konferencije"
                        onChange={(e) => setNaziv(e.target.value)}
                        value={naziv}
                        required
                        ></input>
                        <input
                                    type="text"
                                    className='input'
                                    placeholder="Mjesto održavanja"
                                    onChange={(e) => setMjesto(e.target.value)}
                                    value={mjesto}
                                    required
                                ></input>
                        <label htmlFor='vrijemePoc' className='label'>Vrijeme početka</label>
                                <input
                                    type='time'
                                    className='input'
                                    name='vrijemePoc'
                                    onChange={(e) => setVrijemePocetka(e.target.value)}
                                    value={vrijemePocetka}
                                    required
                                ></input>
                                <label htmlFor='datumPoc' className='label'>Datum početka</label>
                                <input
                                    type='date'
                                    className='input'
                                    name='datumPoc'
                                    onChange={(e) => setDatumPocetka(e.target.value)}
                                    value={datumPocetka}
                                    required
                                ></input>
                                <label htmlFor='vrijemeKraj' className='label'>Vrijeme kraja</label>
                                <input
                                    type='time'
                                    className='input'
                                    name='vrijemeKraj'
                                    onChange={(e) => setVrijemeKraja(e.target.value)}
                                    value={vrijemeKraja}
                                    required
                                ></input>
                                <label htmlFor='datumKraj' className='label'>Datum kraja</label>
                                <input
                                    type='date'
                                    className='input'
                                    name='datumKraj'
                                    onChange={(e) => setDatumKraja(e.target.value)}
                                    value={datumKraja}
                                    required
                                ></input>
                                <input
                                    maxLength={100}
                                    type='text'
                                    className='input'
                                    placeholder="Opis konferencije"
                                    onChange={(e) => setOpis(e.target.value)}
                                    value={opis}
                                    required
                                ></input>
                                <input
                                    type='text'
                                    className='input'
                                    placeholder="Video"
                                    onChange={(e) => setVideo(e.target.value)}
                                    value={video}
                                    required
                                ></input>
                                <input
                                    type="password"
                                    className='input'
                                    placeholder="Lozinka"
                                    onChange={(e) => setKonfLozinka(e.target.value)}
                                    value={konfLozinka}
                                    required
                                ></input>
                                <button type='submit' className='submitButton'>Unesi</button>
                    </form>
                </div>
            </div>
        )}
        {!isAdmin && (
            <div className='nemate-pristup'>
                <span className='pristup-text'>Ups! Nemate pristup ovoj stranici! :/</span>
                <button className='return' onClick={() => navigate(-1)}>Povratak</button>
            </div>
        )}
        <hr></hr>
        </FallingAnimation>
        </>
    )
}

export default DodajKonferenciju
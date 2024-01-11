import FallingAnimation from '../../FallingAnimation'
import { useAuth } from '../../AuthContext';
import './DodajKonferenciju.css'
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const DodajFotografije = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            ime,
            prezime,
            mail,
        };

        try {
            const response = await axios.post('http://localhost:5000/api/dodaj_foto', formData);
            if (response.status === 200) {
                navigate(-1);
            } else {
                console.error('Error adding fotografije:', response.status);
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
                    <h2 className='headertext'>Dodavanje fotografija</h2>
                    <div className='formdiv'>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="img" className='label'>
                                Odaberite jednu ili više fotografija:
                            </label>
                            <input type='file'
                            className='input'
                            accept='.png,.jpg,.jpeg'
                            multiple
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

export default DodajFotografije
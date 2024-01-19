import FallingAnimation from '../../FallingAnimation'
import { useAuth } from '../../AuthContext';
import './DodajKonferenciju.css'
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

const DodajFotografije = () => {
    const navigate = useNavigate();
    const { konferencijaId } = useParams();
    
    const [files, setFiles] = useState([]);

    const storedKorisnik = JSON.parse(localStorage.getItem('korisnik'));
    const isVoditeljNaKonf = storedKorisnik
      ? storedKorisnik.voditelj_na_konf.includes(parseInt(konferencijaId, 10))
      : false;
    const isAdmin = storedKorisnik ? storedKorisnik.admin : false;

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
    
        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }
    
        try {
            const response = await fetch(`http://localhost:5000/api/dodaj_foto/${konferencijaId}`, {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                setUploadMessage('Files uploaded successfully.');
                console.log('Files uploaded successfully');
            } else {
                setUploadMessage('Files upload failed. Please try again.');
                console.error('Files upload failed');
            }
        } catch (error) {
            setUploadMessage('Error uploading files. Please try again later.');
            console.error('Error uploading files:', error);
        }
    };
    
    return (
        <>
        <FallingAnimation>
        <hr></hr>
        {(isAdmin ||isVoditeljNaKonf) && (
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
                            required
                            onChange={handleFileChange}></input>
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

export default DodajFotografije

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FallingAnimation from '../../FallingAnimation';
import { useAuth } from '../../AuthContext';
import './DodajPoster.css'
import '../Superadmin/DodajKonferenciju.css'

const DodajPoster = () => {
    const [nazivPostera, setNazivPostera] = useState('');
    const [opisPostera, setOpisPostera] = useState('');
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [selectedPdfFile, setSelectedPdfFile] = useState(null);
    const [selectedPptFile, setSelectedPptFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');


    const { isAuthenticated, korisnik } = useAuth();
    const { isAdmin } = useAuth();

    const navigate = useNavigate();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const konferencijaId = searchParams.get('konferencijaId');

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImageFile(file);
        setUploadMessage('');
    };

    const handlePdfChange = (event) => {
        const file = event.target.files[0];
        setSelectedPdfFile(file);
        setUploadMessage('');
    };

    const handlePptChange = (event) => {
        const file = event.target.files[0];
        setSelectedPptFile(file);
        setUploadMessage('');
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!selectedImageFile) {
            setUploadMessage('Odaberite slikovnu datoteku prije dodavanja postera.');
            return;
        }
        if (!selectedPdfFile) {
            setUploadMessage('Odaberite pdf datoteku prije dodavanja postera.');
            return;
        }

        const formData = new FormData();
        formData.append('imageFile', selectedImageFile);
        formData.append('pdfFile', selectedPdfFile);
        if (selectedPptFile) {
            formData.append('pptFile', selectedPptFile);
        }
        formData.append('nazivPostera', nazivPostera);
        formData.append('opisPostera', opisPostera);
        formData.append('korisnikId', korisnik.id);
        formData.append('konferencijaId', 3);

        try {
            const response = await fetch('https://dripol.onrender.com/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadMessage('Poster je uspješno dodan u konferenciju.');
                console.log('File uploaded successfully');
            } else {
                setUploadMessage('Dodavanje postera nije uspjelo. Pokušajte ponovno.');
                console.error('File upload failed');
            }
        } catch (error) {
            setUploadMessage('Dodavanje postera nije uspjelo. Pokušajte ponovno kasnije.');
            console.error('Error uploading file:', error);
        }
    };

    return (
        <>
            <FallingAnimation>
                <hr></hr>
                <div className='formcontainer'>
                    <h2 className='headertext'>Dodavanje postera</h2>
                    <div className='formdiv'>
                        <form onSubmit={handleUpload}>
                            <input
                                type="text"
                                className='input'
                                placeholder="Naziv postera"
                                value={nazivPostera}
                                onChange={(e) => setNazivPostera(e.target.value)}
                                required
                            />
                            <input
                                maxLength={100}
                                type='text'
                                className='input'
                                placeholder="Opis postera"
                                value={opisPostera}
                                onChange={(e) => setOpisPostera(e.target.value)}
                                required
                            />
                            <label htmlFor="img" className='label'>
                                Odaberite sliku postera:
                            </label>
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg"
                                onChange={handleImageChange}
                                className='input'
                            />
                            <label htmlFor="pdf" className='label'>
                                Odaberite PDF datoteku:
                            </label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handlePdfChange}
                                className='input'
                            />
                            <label htmlFor="ppt" className='label'>
                                Odaberite PowerPoint datoteku (opcionalno):
                            </label>
                            <input
                                type="file"
                                accept=".ppt"
                                onChange={handlePptChange}
                                className='input'
                            />
                            {uploadMessage && (
                                <p className={`error-mes ${uploadMessage.includes('Poster je uspješno') ? 'success' : 'failure'}`}>
                                    {uploadMessage}
                                </p>
                            )}
                            <button type='submit' className='submitButton'>
                                Unesi
                            </button>
                        </form>

                        {isAdmin && (
                            <div className='view-div'>
                                <button className='view-pending' onClick={() => navigate(`../pregled-radova/:${konferencijaId}`)}>Pregledaj unesene radove</button>
                            </div>
                        )}
                    </div>
                </div>
            </FallingAnimation>
        </>
    );
};

export default DodajPoster;
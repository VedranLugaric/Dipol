import { useState, useEffect } from 'react';
import { Link,useLocation  } from 'react-router-dom';
import FallingAnimation from '../../FallingAnimation';
import { useAuth } from '../../AuthContext';

const DodajPoster = () => {
    const [nazivPostera, setNazivPostera] = useState('');
    const [opisPostera, setOpisPostera] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');

    const { isAuthenticated, korisnik } = useAuth();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const konferencijaId = searchParams.get('konferencijaId');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setUploadMessage('');
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            setUploadMessage('Please select an image file before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('nazivPostera', nazivPostera);
        formData.append('opisPostera', opisPostera);
        formData.append('korisnikId', korisnik.id);
        formData.append('konferencijaId', 3);

        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadMessage('File uploaded successfully.');
                console.log('File uploaded successfully');
            } else {
                setUploadMessage('File upload failed. Please try again.');
                console.error('File upload failed');
            }
        } catch (error) {
            setUploadMessage('Error uploading file. Please try again later.');
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
                                Select image:
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.ppt,.png,.jpg,.jpeg"
                                onChange={handleFileChange}
                                className='input'
                            />
                            <button type='submit' className='submitButton'>
                                Unesi
                            </button>
                        </form>
                    </div>
                </div>
                <hr></hr>
                {uploadMessage && <p>{uploadMessage}</p>}
            </FallingAnimation>
        </>
    );
};

export default DodajPoster;

import FallingAnimation from "../../FallingAnimation"
import './PregledRadova.css'
import { useAuth } from '../../AuthContext';
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

    const handleDownloadPDF = (pdfLink) => {
        var posteriContainer = document.querySelector('.posteri-container');
        if (posteriContainer) {
            // Create the object element
            var pdfObject = document.createElement('object');
            pdfObject.className = 'pdf-viewer';
            pdfObject.setAttribute('data', pdfLink);
            pdfObject.setAttribute('type', 'application/pdf');
            pdfObject.setAttribute('width', '100%');
            pdfObject.setAttribute('height', '100%');
        
            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Izlaz iz pdf-a';
            deleteButton.className = 'exitpdf';
            deleteButton.onclick = function () {
                // Remove both the button and the object from the div
                posteriContainer.removeChild(deleteButton);
                posteriContainer.removeChild(pdfObject);
            };
        
            // Append the button and the object elements to the div
            posteriContainer.appendChild(deleteButton);
            posteriContainer.appendChild(pdfObject);

        } else {
            console.error('Div with class name "posteri-container" not found.');
        }
      };

    const handleDownloadPPT = (pptLink) => {
        const pdfUrl = pptLink;
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "document.ppt"; // specify the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
        <FallingAnimation>
            <hr></hr>
            {!isAdmin && (
                <div className="posteri-container">
                {radovi && 
                    radovi.map((rad, index) => (
                        <>
                        <div className="poster-item">
                            <div className="poster-img-div">
                                    <img className="poster-img" src={rad.poster_link} alt = 'Src rada'/>
                            </div>
                            <div className="rad-texts" key = {index}>
                            <hr></hr>
                                <p className="rad-title">{rad.naslov}</p>
                                <p className="autor-rada">Autor</p>
                            </div>
                            <div className="buttons">
                                    <button onClick={() => handleAccept(rad.id_rad)} className="accept-button">Prihvati</button>
                                    <button onClick={() => handleReject(rad.id_rad)}className="reject-button">Odbaci</button>
                                    {rad.pdf_link && (
                                    <button onClick={() => handleDownloadPDF(rad.pdf_link)} className="ppt-button">pdf</button>
                                    )}
                                    {rad.prez_link && (
                                      <button onClick={() => handleDownloadPPT(rad.prez_link)} className="ppt-button">ppt</button>
                                    )}
                                    
                            </div>
                        </div>
                        </>
                    ))}
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

export default PregledRadova
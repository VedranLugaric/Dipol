import YouTube from "react-youtube";
import './Uzivo.css'
import FallingAnimation from '../../FallingAnimation';
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import { useAuth } from '../../AuthContext';
const Uzivo = () => {
    const [videoSrc, setVideoSrc] = useState("");
    const { korisnik, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { konferencijaId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const hasEnteredPassword = localStorage.getItem(`konferencija_${konferencijaId}_entered`);
  
    useEffect(() => {
        const fetchVideoSrc = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://dripol.onrender.com/api/live/${konferencijaId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Id': korisnik.id,
                    },
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setVideoSrc(data.video);
                    console.log(videoSrc);
                    setIsLoading(false);
                } else if (response.status === 403) {
                    const data = await response.json();
                    if (data.error === 'User not in conference') {
                        console.error("User not in conference");
                    }
                } else {
                    console.error("Failed to fetch data");
                }
            } catch (error) {
                console.error('Fetch error:', error.message);
                throw new Error('Problem s dohvatom video zapisa');
            }
        };
    
        fetchVideoSrc();
    }, [konferencijaId]);
    
    return (
        <FallingAnimation>
            <hr></hr>
            {hasEnteredPassword === 'true' ? (
                <div >
                    <YouTube className="video" videoId={videoSrc} opts={{ width: '100%' }} />
                </div>
            ) : (
                <div className='nemate-pristup'>
                    <span className='pristup-text'>Ups! Nemate pristup ovoj stranici! :/</span>
                    <button className='return' onClick={() => navigate('../konferencije')}>Povratak</button>
                </div>
            )}
        </FallingAnimation>
    )
}


export default Uzivo

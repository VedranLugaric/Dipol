import YouTube from "react-youtube";
import './Uzivo.css'
import FallingAnimation from '../../FallingAnimation';
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import { useAuth } from '../../AuthContext';
const Uzivo = () => {
    //ovaj src se treba zamijeniti src-om iz baze
    const [videoSrc, setVideoSrc] = useState("");
    const { korisnik, isAuthenticated } = useAuth();
    
    const { konferencijaId } = useParams();
  

    useEffect(() => {
      const fetchVideoSrc = async () => {
          try {
              const response = await fetch(`http://localhost:5000/api/live/${konferencijaId}`, {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });

              if (response.ok) {
                  const data = await response.json();
                  setVideoSrc(data.video);
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
            {isAuthenticated && (
            <div >
            <YouTube className="video" videoId={videoSrc} opts={{ width: '100%' }} />
            </div>
            )}
            {!isAuthenticated && (
                <div className='nemate-pristup'>
                <span className='pristup-text'>Ups! Nemate pristup ovoj stranici! :/</span>
                <button className='return' onClick={() => navigate(-1)}>Povratak</button>
            </div>
            )}
        </FallingAnimation>
    )

}


export default Uzivo

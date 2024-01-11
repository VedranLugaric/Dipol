// Poster.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import FallingAnimation from '../../FallingAnimation';
import { Document, Page, pdfjs } from 'react-pdf';
import './Poster.css';
import { useAuth } from '../../AuthContext';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

const Poster = ({ conferenceId }) => {
  const [data, setData] = useState({ posters: [], radovi: [], pokrovitelji: [] });
  const [loading, setLoading] = useState(true);
  const { konferencijaId } = useParams();
  const { korisnik, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }

    const fetchData = async () => {
      try {
        const posterResponse = await fetch(`http://localhost:5000/api/posteri/${konferencijaId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id_sud: korisnik.id }),
        });

        const pokroviteljResponse = await fetch(`http://localhost:5000/api/pokrovitelj/${konferencijaId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (posterResponse.ok && pokroviteljResponse.ok) {
          const posterData = await posterResponse.json();
          const pokroviteljData = await pokroviteljResponse.json();

          setData({ posters: posterData.posteri, radovi: posterData.radovi, pokrovitelji: pokroviteljData.pokrovitelj });
        } else {
          console.error('Failed to fetch data');
          navigate('../konferencije');
        }
      } catch (error) {
        console.error('Fetch error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [conferenceId, korisnik.id, isAuthenticated, navigate]);

  return (
    <FallingAnimation>
      <hr></hr>
      <div className='poster-container'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className='posteri-container'>
              {data.posters.map((poster, index) => (
                <PosterItem key={poster.poster_id} poster={poster} rad={data.radovi[index]} />
              ))}
            </div>
            <div className='pokrovitelji-container'>
              <h2>Pokrovitelji</h2>
              {data.pokrovitelji.map((pokrovitelj) => (
                <div key={pokrovitelj.id} className='pokrovitelj-item' onClick={() => window.open(pokrovitelj.stranica, '_blank')}>
                  <p>{pokrovitelj.ime}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </FallingAnimation>
  );
};
  
const PosterItem = ({ poster, rad, conferenceId }) => {
  const [hasVoted, setHasVoted] = useState(rad.hasVoted);
  const [errorMessage, setErrorMessage] = useState('');
  const { korisnik } = useAuth();
  const { konferencijaId } = useParams();
  const [zoomedIn, setZoom] = useState('');

  const zoomIn = () => {
    setZoom(true)
  }
  const zoomOut = () => {
    setZoom(false)
  }

  const handleVote = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/vote/${rad.rad_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vote: 1, id_sud: korisnik.id, konferencijaId: konferencijaId }),
      });

      if (response.ok) {
        setHasVoted(true);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error('Vote error:', error.message);
    }
  };

  return (
    <>
        <div className='poster-item'>
            <div className='poster-img-div'>
                {poster.poster_image_link && (
                    <img onClick={zoomIn}
                    className='poster-img' src={poster.poster_image_link} alt='Poster preview' />
                )}
                <div className='rad-texts'>
                <hr></hr>
                    {rad && <p className='rad-title'>{rad.naslov}</p>}
                    <p className='autor'>Dodati ime autora</p>
                </div>
            </div>
            <button className='vote-button' onClick={handleVote} disabled={hasVoted}>
                {hasVoted ? 'VOTED' : 'VOTE'}
            </button>

            {errorMessage && <p>{errorMessage}</p>}
        </div>
        {zoomedIn && (
            <div className='zoom-in'>
                {poster.poster_image_link && (
                    <img onClick={zoomOut}
                    className='poster-zoom' src={poster.poster_image_link} alt='Poster preview' />
                )}
            </div>
        )}
    </>
    );
};

 

export default Poster;

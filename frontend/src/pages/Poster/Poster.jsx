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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { konferencijaId } = useParams();
  const { korisnik } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch(`http://localhost:5000/api/posteri/${konferencijaId}`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ id_sud: korisnik.id }),
              });

              if (response.ok) {
                  const data = await response.json();
                  setData(data);
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
  }, [conferenceId, korisnik.id]);

  
    return (
      <FallingAnimation>
        <div className='poster-container'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {data.posteri.map((poster, index) => (
                <PosterItem key={poster.poster_id} poster={poster} rad={data.radovi[index]} />
              ))}
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
    <div className='poster-item'>
      {/* Display the poster image URL and the rad name */}
      <div className='poster-preview'>
        {poster.poster_image_link && (
          <img src={poster.poster_image_link} alt='Poster Preview' />
        )}
        {rad && <span className='rad-title'>{rad.naslov}</span>}
      </div>

      {/* Add a vote button */}
      <button onClick={handleVote} disabled={hasVoted}>
        {hasVoted ? 'Voted' : 'Vote'}
      </button>

      {/* Display an error message if the user has already voted */}
      {errorMessage && <p>{errorMessage}</p>}

      {/* Add any other UI elements you need for each poster */}
    </div>
  );
};

export default Poster;

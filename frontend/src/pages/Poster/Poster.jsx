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
  const { isAdmin } = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }

    const fetchData = async () => {
      try {
        const radResponse = await fetch(`http://localhost:5000/api/posteri/${konferencijaId}`, {
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

        if (radResponse.ok && pokroviteljResponse.ok) {
          const radData = await radResponse.json();
          const pokroviteljData = await pokroviteljResponse.json();

          setData({ radovi: radData.radovi, pokrovitelji: pokroviteljData.pokrovitelj });
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
          <div className='add-pok-div'>
          {!isAdmin && (
            <>
            <button className='addkonf' onClick={() => navigate(`/dodaj-pokrovitelja/${konferencijaId}`)}>
              <span className="circle1"></span>
              <span className="circle2"></span>
              <span className="circle3"></span>
              <span className="circle4"></span>
              <span className="circle5"></span>
              <span className="text">Dodaj pokrovitelja</span>
            </button>
            <button className='addkonf' onClick={() => navigate(`/dodaj-fotografije/${konferencijaId}`)}>
              <span className="circle1"></span>
              <span className="circle2"></span>
              <span className="circle3"></span>
              <span className="circle4"></span>
              <span className="circle5"></span>
              <span className="text">Dodaj fotografije</span>
            </button>
            <button className='button' onClick={() => navigate(`/galerija/${konferencijaId}`)}>
                <span className='circle1'></span>
                <span className='circle2'></span>
                <span className='circle3'></span>
                <span className='circle4'></span>
                <span className='circle5'></span>
                <span className='text'>Galerija fotografija</span>
              </button>
            </>
          )}
          </div>
        {loading ? (
          <h2>Loading...</h2>
        ) : (
          <>
            <div className='posteri-container'>
              {data.radovi.map((rad) => (
                <PosterItem key={rad.rad_id} rad={rad} />
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
  
const PosterItem = ({ rad, conferenceId }) => {
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

  const handleDownloadPDF = (pdfLink) => {
    var posteriContainer = document.querySelector('.posteri-container');
    if (posteriContainer) {
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
            posteriContainer.removeChild(deleteButton);
            posteriContainer.removeChild(pdfObject);
        };
    
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
    link.download = "document.ppt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

  return (
    <>
        <div className='poster-item'>
            <div className='poster-img-div'>
                {rad.poster_image_link && (
                    <img onClick={zoomIn}
                    className='poster-img' src={rad.poster_image_link} alt='Poster preview' />
                )}
                <div className='rad-texts'>
                <hr></hr>
                    {rad && <p className='rad-title'>{rad.naslov}</p>}
                    <p className='autor'>Dodati ime autora</p>
                </div>
            </div>
            <div className='buttons-poster'>
            <button className='vote-button' onClick={handleVote} disabled={hasVoted}>
                {hasVoted ? 'VOTED' : 'VOTE'}
            </button>
            <div className='pdf-ppt-buttons'>
              {rad.pdf_link && (
                <button onClick={() => handleDownloadPDF(rad.pdf_link)} className="ppt-button">pdf</button>
              )}
              {rad.prez_link && (
                <button onClick={() => handleDownloadPPT(rad.prez_link)} className="ppt-button">ppt</button>
              )}    
            </div>
                    
            </div>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
        {zoomedIn && (
            <div className='zoom-in'>
                {rad.poster_image_link && (
                    <img onClick={zoomOut}
                    className='poster-zoom' src={rad.poster_image_link} alt='Poster preview' />
                )}
            </div>
        )}
    </>
    );
};

export default Poster;

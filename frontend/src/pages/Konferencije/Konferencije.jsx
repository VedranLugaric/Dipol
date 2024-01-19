import './Konferencije.css'
import FallingAnimation from '../../FallingAnimation';
import Poster from '../Poster/Poster';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext';
import { useEffect, useState } from 'react';
import './Pass-prompt-konferencija.css'
import GfGWeatherApp from '../WeatherApp/WeatherApp';



const Konferencije = () => {
    const [konferencije, setPodaci] = useState([])

    useEffect(() => {
        const fetchKonferencije = async () => {
            try {
                const response = await fetch('https://dripol.onrender.com/api/konferencije', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPodaci(data);
                } else {
                    throw new Error('Problem s dohvatom konferencija');
                }
            } catch (error) {
                console.error('Fetch error:', error.message);
                throw new Error('Problem s dohvatom konferencija');
            }
        };

        fetchKonferencije();
    }, []);

    return(
        <>
        <FallingAnimation>
        <hr></hr>
        <DodajKonferenciju />
        <div className='konfContainer'>
            <div className='tekst'>Aktivne konferencije: </div>
                <div className='aktivne'>
                    <Aktivne aktivne={konferencije.aktivne} />
                <div/>
            <div className='tekst'>Nadolazeće konferencije: </div>
                <div className='nadolazece'>
                    <Nadolazeće nadolazece={konferencije.nadolazece} />
                </div>
          </div>
        </div>
        <hr></hr>
        </FallingAnimation>
        </>
    )
}

const Aktivne = ({aktivne}) => {
  const { isAuthenticated, korisnik } = useAuth();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [selectedKonferencija, setSelectedKonferencija] = useState(null);
  const [lozinka, setLozinka] = useState('');
  const [joinLive, setLive] = useState('')
  const navigate = useNavigate();

  const handlePristupiClick = (konf) => {
    setSelectedKonferencija(konf);
    const hasEnteredPassword = localStorage.getItem(`konferencija_${konf.id}_entered`);
    if (hasEnteredPassword === 'true') {
        setShowPasswordPrompt(false);
        navigate(`../posteri/${konf.id}`);
      } else {
        setShowPasswordPrompt(true);
    }
  }
  
  const handleLiveClick = (konf) => {
    setSelectedKonferencija(konf);
    const hasEnteredPassword = localStorage.getItem(`konferencija_${konf.id}_entered`);
    if (hasEnteredPassword === 'true') {
      setShowPasswordPrompt(false);
      setLive(true);
      navigate(`../live/${konf.id}`)
    } else {
        setShowPasswordPrompt(true);
        setLive(true);
    }
  }  

  const handleSubmitPassword = async () => {
    if (lozinka === selectedKonferencija.lozinka) {
        setShowPasswordPrompt(false);

        localStorage.setItem(`konferencija_${selectedKonferencija.id}_entered`, 'true');

        const userCreationData = {
            konferencijaId: selectedKonferencija.id,
            korisnikId: korisnik.id,
        };

        try {
            const response = await fetch('https://dripol.onrender.com/api/create_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userCreationData),
            });

            if (response.ok) {
              if(joinLive) {
                setLive(false)
                navigate(`../live/${selectedKonferencija.id}`)
              }else {
                navigate(`../posteri/${selectedKonferencija.id}`);
              }
            } else {
                const errorData = await response.json();
                console.error('Error creating user:', errorData);
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    } else {
        alert("Pogrešna lozinka!")
    }
  };

  const handleExitPopup = () => {
    setShowPasswordPrompt(false)
  }

  return (
    <div>
      {aktivne &&
        aktivne.map((konf, index) => (
          <>
          <div className='conf-weather-cont'>
          <div className='konferencija' key={index}>
            <div className='konfImg'></div>
            <div className='texts'>
              <span className='naziv'>{konf.naziv}</span>
              <span className='mjesto'>{konf.mjesto}</span>
              <span className='opis'>{konf.opis}</span>
            </div>
            {isAuthenticated && (
              <div className='pristupi'>
                <button className='pristupibutton'
                onClick={() => handleLiveClick(konf)}>
                  <span className='circle1'></span>
                  <span className='circle2'></span>
                  <span className='circle3'></span>
                  <span className='circle4'></span>
                  <span className='circle5'></span>
                  <span className='text'>Live</span>
                </button>
                <button
                  className='pristupibutton'
                  onClick={() => handlePristupiClick(konf)}
                >
                  <span className='circle1'></span>
                  <span className='circle2'></span>
                  <span className='circle3'></span>
                  <span className='circle4'></span>
                  <span className='circle5'></span>
                  <span className='text'>Pristupi</span>
                </button>
              </div>
            )}
            
            {showPasswordPrompt && selectedKonferencija == konf &&  (
        <div className='popup-background'>
            <div className='password-prompt'>
            <button className='exit' onClick={handleExitPopup}>x</button>
              <label className='pass-label'>Unesite lozinku konferencije "{konf.naziv}":</label>
              <input className='pass-input'
                type='password'
                value={lozinka}
                onChange={(e) => setLozinka(e.target.value)}
              />
              <div className='pristupi-pass-div'>
              <button className='pristupi-pass' 
              onClick={handleSubmitPassword}>
                <span className='circle1'></span>
                <span className='circle2'></span>
                <span className='circle3'></span>
                <span className='circle4'></span>
                <span className='circle5'></span>
                <span className='text'>Pristupi</span>
            </button>
            {!showPasswordPrompt && (
            <Poster key={index} conferenceId={selectedKonferencija.id} />
            )}
            </div>
            </div>
        </div>
      )}
          </div>
          <GfGWeatherApp grad={konf.mjesto} />
          </div>
          </>
        ))}
    </div>
  );
}

const Nadolazeće = ({nadolazece}) => {
    return (
        <div>
            {nadolazece && nadolazece.map((konf, index) => (
                  <div className='conf-weather-cont' key={index}>
                    <div className='konferencija' key={index}>
                        <div className='konfImg'></div>
                        <div className='texts'>
                            <span className='naziv'>{konf.naziv}</span>
                            <div className='mjestodatum'>
                                <span className='mjesto'>{konf.mjesto}</span>
                                <span className='dash'>-</span>
                                <span className='datum'>{konf.datum}</span>
                            </div>
                            <span className='opis'>{konf.opis}</span>
                        </div>
                    </div>
                    <DodajPosterButton konferencijaId={konf.id} />
                </div>
            ))}
        </div>
    )
}

const DodajKonferenciju = () => {
  const storedKorisnik = JSON.parse(localStorage.getItem('korisnik'));
  const isAdmin = storedKorisnik ? storedKorisnik.admin : false;
  
  return (
    <>
      {isAdmin && (
        <div className='addkonfdiv'>
          <Link to='/dodajkonferenciju'>
            <button className='addkonf'>
              <span className="circle1"></span>
              <span className="circle2"></span>
              <span className="circle3"></span>
              <span className="circle4"></span>
              <span className="circle5"></span>
              <span className="text">Dodaj konferenciju</span>
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

const DodajPosterButton = ({ konferencijaId }) => {
  const storedKorisnik = JSON.parse(localStorage.getItem('korisnik'));
  const isVoditeljNaKonf = storedKorisnik
    ? storedKorisnik.voditelj_na_konf.includes(konferencijaId)
    : false;
  const isAdmin = storedKorisnik ? storedKorisnik.admin : false;
  const navigate = useNavigate()

  return (
    <div className="nad-buttons">
      <Link to={`/dodajposter?konferencijaId=${konferencijaId}`}>
        <button className='addposter'>
          <span className="circle1"></span>
          <span className="circle2"></span>
          <span className="circle3"></span>
          <span className="circle4"></span>
          <span className="circle5"></span>
          <span className="text">Dodaj poster</span>
        </button>
      </Link>
      {(isAdmin || isVoditeljNaKonf) && (
        <>
        <Link to={`../pregled-radova/${konferencijaId}`}>
        <button className='addposter'>
          <span className="circle1"></span>
          <span className="circle2"></span>
          <span className="circle3"></span>
          <span className="circle4"></span>
          <span className="circle5"></span>
          <span className="text">Pregledaj radove</span>
        </button>
      </Link>
      </>
      )}
      {isAdmin && (
        <>
      <Link to={`../dodaj-voditelja/${konferencijaId}`}>
        <button className='addposter'>
          <span className="circle1"></span>
          <span className="circle2"></span>
          <span className="circle3"></span>
          <span className="circle4"></span>
          <span className="circle5"></span>
          <span className="text">Dodaj voditelja</span>
        </button>
      </Link>
      <button className='addposter' onClick={() => navigate(`/dodaj-pokrovitelja/${konferencijaId}`)}>
                <span className="circle1"></span>
                <span className="circle2"></span>
                <span className="circle3"></span>
                <span className="circle4"></span>
                <span className="circle5"></span>
                <span className="text">Dodaj pokrovitelja</span>
              </button>
      </>
      )}
    </div>
  );
};

export default Konferencije;
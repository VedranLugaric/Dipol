import './Konferencije.css'
import FallingAnimation from '../../FallingAnimation';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext';
import { useEffect } from 'react';
import { useState } from 'react';

const Konferencije = () => {
    const [konferencije, setPodaci] = useState([])

    useEffect(() => {
        const fetchKonferencije = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/konferencije', {
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


/*{ 
    Hardkodirani podaci koje koristim da ne moram palit bazu :)

    const aktivne = [{     
        "id" : "1",
        "naziv" : "Napoleonove bitke",
        "mjesto" : "Zagreb",
        "opis" : "Tematike ove konferencije su Napoleonove bitke"
       
        },
        {
        "id" : "2",
        "naziv" : "Rođendanske torte",
        "mjesto" : "Varaždin",
        "opis" : "Najbolja rođendanska torta"
        },
        {
        "id" : "3",
        "naziv" : "Legendarni slikari",
        "mjesto" : "Split",
        "opis" : "Svi slikari"
        },
    ]

    const nadolazece = [{     
        "id" : "4",
        "naziv" : "Mjuzikli",
        "mjesto" : "Zagreb",
        "datum" : "21.1.2024.",
        "opis" : "Opis za mjuzikle"
      
    }]
    }*/

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
    const { isAuthenticated } = useAuth();
    
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [selectedKonferencija, setSelectedKonferencija] = useState(null);
    const [lozinka, setLozinka] = useState('');
    const [lozinkaValidationMessage, setLozinkaValidationMessage] = useState('');
    const navigate = useNavigate();

    const handlePristupiClick = (konf) => {
        setSelectedKonferencija(konf);
        setShowPasswordPrompt(true);
    }

    const handleSubmitPassword = () => {

        if (lozinka === selectedKonferencija.lozinka) {
          navigate('../poster');
          setShowPasswordPrompt(false);
        } else {
          setLozinkaValidationMessage('Pogrešna lozinka!');
        }
      };

      return (
        <div>
          {aktivne &&
            aktivne.map((konf, index) => (
              <div className='konferencija' key={index}>
                <div className='konfImg'></div>
                <div className='texts'>
                  <span className='naziv'>{konf.naziv}</span>
                  <span className='mjesto'>{konf.mjesto}</span>
                  <span className='opis'>{konf.opis}</span>
                </div>
                {isAuthenticated && (
                  <div className='pristupi'>
                    <button
                      className='pristupibutton'
                      onClick={() => handlePristupiClick(konf)}
                    >
                      <span class='circle1'></span>
                      <span class='circle2'></span>
                      <span class='circle3'></span>
                      <span class='circle4'></span>
                      <span class='circle5'></span>
                      <span class='text'>Pristupi</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          {/* Add the password prompt here based on the state */}
          {showPasswordPrompt && (
            <div className='password-prompt'>
              <label>Lozinka:</label>
              <input
                type='password'
                value={lozinka}
                onChange={(e) => setLozinka(e.target.value)}
              />
              {/* Add validation message rendering */}
              {lozinkaValidationMessage && (
                <div className='validation-message'>
                  {lozinkaValidationMessage}
                </div>
              )}
              {/* Add a button to submit the password */}
              <button onClick={handleSubmitPassword}>Pristupi</button>
            </div>
          )}
        </div>
      );

    // return (
    //     <div>
    //         {aktivne && aktivne.map((konf, index) => (
    //             <div className='konferencija' key={index}>
    //                 <div className='konfImg'></div>
    //                 <div className='texts'>
    //                     <span className='naziv'>{konf.naziv}</span>
    //                     <span className='mjesto'>{konf.mjesto}</span>
    //                     <span className='opis'>{konf.opis}</span>
    //                 </div>
    //                 {isAuthenticated && (
    //                     <div className='pristupi'>
    //                         <Link to='/poster'>
    //                             <button className='pristupibutton'>
    //                                 <span class="circle1"></span>
    //                                 <span class="circle2"></span>
    //                                 <span class="circle3"></span>
    //                                 <span class="circle4"></span>
    //                                 <span class="circle5"></span>
    //                                 <span class="text">Pristupi</span>
    //                             </button>
    //                         </Link>
    //                     </div>
    //                 )}
    //             </div>
    //         ))}
    //     </div>
    // )
}

const Nadolazeće = ({nadolazece}) => {
    return (
        <div>
            {nadolazece && nadolazece.map((konf, index) => (
                <div className='konferencija-button'>
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
                    <DodajPoster />
                </div>
            ))}
        </div>
    )
}

const DodajKonferenciju = () => {
    {/* Potrebno dodati uvjet koji provjerava je li ulogiran superadmin*/}
    
    return (
        <>
        <div className='addkonfdiv'>
            <Link to='/dodajkonferenciju'>
                <button className='addkonf'>
                    <span class="circle1"></span>
                    <span class="circle2"></span>
                    <span class="circle3"></span>
                    <span class="circle4"></span>
                    <span class="circle5"></span>
                    <span class="text">Dodaj konferenciju</span>
                </button>
            </Link>
        </div>
        </>
    )
}

const DodajPoster = () => {
     {/* Potrebno dodati uvjet koji provjerava je li ulogiran admin konferencije*/}
     
     return (
        <>
        <Link to="/dodajposter">
            <button className='addposter'>
                <span class="circle1"></span>
                <span class="circle2"></span>
                <span class="circle3"></span>
                <span class="circle4"></span>
                <span class="circle5"></span>
                <span class="text">Dodaj poster</span>
            </button>
        </Link>
        </>
     )
}

export default Konferencije;